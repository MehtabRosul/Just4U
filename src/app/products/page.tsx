
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 50;

// Simplified ActiveFilters, only sortOption is actively used for product list modification now
interface ActiveFilters {
  category: string; // Kept for page title generation, but not for filtering product list
  priceRange: [number, number]; // Kept for potential future re-introduction, but not for filtering
  occasion: string; // Kept for page title generation, but not for filtering
  recipient: string; // Kept for page title generation, but not for filtering
}

// Top-level diagnostic log
console.log('[DIAGNOSTIC_TOP_LEVEL] PRODUCTS imported. Length:', PRODUCTS?.length);
if (PRODUCTS?.length > 0) {
  console.log('[DIAGNOSTIC_TOP_LEVEL] First product ID from PRODUCTS:', PRODUCTS[0].id, "Name:", PRODUCTS[0].name, "Price:", PRODUCTS[0].price);
} else {
  console.error('[DIAGNOSTIC_TOP_LEVEL_ERROR] PRODUCTS array is empty or undefined after import!');
}

const calculateMaxProductPrice = (products: Product[]): number => {
  if (!products || products.length === 0) {
    console.warn('[DIAGNOSTIC_CALC_MAX_PRICE] PRODUCTS array is empty or undefined during max price calculation. Defaulting to MAX_SAFE_INTEGER.');
    return Number.MAX_SAFE_INTEGER;
  }
  const prices = products.map(p => p.price).filter(price => typeof price === 'number' && !isNaN(price));
  if (prices.length === 0) {
    console.warn('[DIAGNOSTIC_CALC_MAX_PRICE] No valid prices found in PRODUCTS. Defaulting to MAX_SAFE_INTEGER.');
    return Number.MAX_SAFE_INTEGER;
  }
  const max = Math.max(...prices);
  console.log(`[DIAGNOSTIC_CALC_MAX_PRICE] Calculated initialMaxPrice to be: ${max > 0 ? max : Number.MAX_SAFE_INTEGER}`);
  return max > 0 ? max : Number.MAX_SAFE_INTEGER;
};


export default function ProductsPage() {
  console.log('[DIAGNOSTIC_RENDER] ProductsPage component rendering. Base PRODUCTS length:', PRODUCTS?.length);
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  
  // Calculate initialMaxPrice once on mount using a callback for useState's initial value
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(() => {
    if (typeof window !== 'undefined') { // Ensure this runs client-side
        return calculateMaxProductPrice(PRODUCTS);
    }
    return Number.MAX_SAFE_INTEGER; // Fallback for SSR or if window is not defined yet
  });

  // ActiveFilters state - simplified use, mainly for page title and sort now
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, Number.MAX_SAFE_INTEGER], // Default to widest possible, but not used for filtering list
    occasion: 'all',
    recipient: 'all',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setHasMounted(true);
    // Recalculate initialMaxPrice on client side if not already set properly
    setInitialMaxPrice(calculateMaxProductPrice(PRODUCTS));
    console.log(`[DIAGNOSTIC_MOUNT_EFFECT] Component mounted. InitialMaxPrice calculated and set to: ${initialMaxPrice}`);
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (!hasMounted || initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0 && calculateMaxProductPrice(PRODUCTS) !== Number.MAX_SAFE_INTEGER) {
      console.log('[DIAGNOSTIC_URL_EFFECT] Skipping effect: component not fully mounted or initialMaxPrice needs recalculation based on client-side PRODUCTS.');
      // If PRODUCTS were not available server-side for initialMaxPrice, recalculate.
      if (hasMounted && initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0) {
         const clientCalculatedMaxPrice = calculateMaxProductPrice(PRODUCTS);
         if (clientCalculatedMaxPrice !== Number.MAX_SAFE_INTEGER) {
            setInitialMaxPrice(clientCalculatedMaxPrice);
            console.log(`[DIAGNOSTIC_URL_EFFECT] Recalculated initialMaxPrice on client: ${clientCalculatedMaxPrice}`);
         }
      }
      return;
    }
    console.log(`[DIAGNOSTIC_URL_EFFECT] Running. searchParams: ${searchParams.toString()} Current initialMaxPrice: ${initialMaxPrice}`);

    const categoryFromUrl = searchParams.get('category') || 'all';
    const occasionFromUrl = searchParams.get('occasion') || 'all';
    const recipientFromUrl = searchParams.get('recipient') || 'all';
    const sortFromUrl = (searchParams.get('sort') as SortOption) || 'popularity';

    const priceMinQuery = searchParams.get('priceMin');
    const priceMaxQuery = searchParams.get('priceMax');
    
    let newMinPrice = 0;
    if (priceMinQuery !== null) {
        const parsedMin = parseInt(priceMinQuery, 10);
        if (!isNaN(parsedMin) && parsedMin >= 0) {
            newMinPrice = parsedMin;
        }
    }

    let newMaxPrice = initialMaxPrice; 
    if (priceMaxQuery !== null) {
        const parsedMax = parseInt(priceMaxQuery, 10);
        if (!isNaN(parsedMax) && parsedMax >= newMinPrice) { 
            newMaxPrice = parsedMax;
        } else if (!isNaN(parsedMax) && parsedMax < newMinPrice && newMinPrice > 0) {
            console.warn(`[DIAGNOSTIC_URL_EFFECT] URL priceMax (${parsedMax}) is less than priceMin (${newMinPrice}). Using initialMaxPrice (${initialMaxPrice}).`);
            newMaxPrice = initialMaxPrice; 
        } else if (isNaN(parsedMax)) {
            console.warn(`[DIAGNOSTIC_URL_EFFECT] URL priceMax ('${priceMaxQuery}') is NaN. Using initialMaxPrice (${initialMaxPrice}).`);
        }
    }
    
    if (newMinPrice > newMaxPrice || (newMaxPrice === 0 && initialMaxPrice > 0) || isNaN(newMinPrice) || isNaN(newMaxPrice)) {
        console.warn(`[DIAGNOSTIC_URL_EFFECT] Invalid price range after parsing URL (min: ${newMinPrice}, max: ${newMaxPrice}). Resetting to [0, ${initialMaxPrice}].`);
        newMinPrice = 0; 
        newMaxPrice = initialMaxPrice;
    }
    
    const newUrlFiltersState: ActiveFilters = {
        category: categoryFromUrl,
        priceRange: [newMinPrice, newMaxPrice], // Stored but not used for list filtering
        occasion: occasionFromUrl,
        recipient: recipientFromUrl,
    };

    let filtersActuallyChanged = false;
    if (JSON.stringify(activeFilters) !== JSON.stringify(newUrlFiltersState)) {
        setActiveFilters(newUrlFiltersState);
        setCurrentPage(1); 
        filtersActuallyChanged = true;
        console.log('[DIAGNOSTIC_URL_EFFECT] Setting new activeFilters from URL:', newUrlFiltersState);
    }
    
    if (sortOption !== sortFromUrl) {
      setSortOption(sortFromUrl);
      if (!filtersActuallyChanged) { // Only reset page if sort changed but not other filters
          setCurrentPage(1);
      }
      console.log(`[DIAGNOSTIC_URL_EFFECT] Setting new sortOption from URL: ${sortFromUrl}`);
    }

    if (!filtersActuallyChanged && sortOption === sortFromUrl) {
        console.log('[DIAGNOSTIC_URL_EFFECT] No change in activeFilters or sortOption needed from URL.');
    }

  }, [searchParams, hasMounted, initialMaxPrice]); // Removed activeFilters and sortOption from dependencies as they are set here


  const filteredAndSortedProducts = useMemo(() => {
    console.log('[DIAGNOSTIC_FILTER_MEMO] Recalculating filteredAndSortedProducts.');
    if (!PRODUCTS || PRODUCTS.length === 0) {
      console.warn('[DIAGNOSTIC_FILTER_MEMO] PRODUCTS array is empty or undefined. Returning empty array.');
      return [];
    }
    console.log('[DIAGNOSTIC_FILTER_MEMO] Base PRODUCTS length:', PRODUCTS.length);
    
    // START WITH ALL PRODUCTS - NO FILTERING
    let tempProducts = [...PRODUCTS];
    console.log('[DIAGNOSTIC_FILTER_MEMO] Initial product count (all products):', tempProducts.length);
    
    // Apply sorting
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Products before sorting: ${tempProducts.length}. Sort option: ${sortOption}`);
    switch (sortOption) {
      case 'popularity': tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
      case 'price_asc': tempProducts.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price_desc': tempProducts.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name_asc': tempProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': tempProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'trending':
        tempProducts.sort((a, b) => {
          const trendingA = a.trending ? 1 : 0;
          const trendingB = b.trending ? 1 : 0;
          if (trendingB !== trendingA) {
            return trendingB - trendingA; 
          }
          return (b.popularity || 0) - (a.popularity || 0); 
        });
        break;
      default:
        // Default to popularity if sortOption is somehow invalid
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    console.log(`[DIAGNOSTIC_FILTER_MEMO] After sorting by '${sortOption}', final count for memo: ${tempProducts.length}`);
    return tempProducts;

  }, [sortOption]); // Dependency is now only sortOption, as filtering is removed
  
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log(`[DIAGNOSTIC_RENDER] currentProducts for page ${currentPage}: ${currentProducts.length} items. Total pages: ${totalPages}. Total in filteredAndSortedProducts: ${filteredAndSortedProducts.length}`);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); 
    }
  };
  
  const generatePageTitle = () => {
    // Simplified title since filters are not applied to the list itself anymore for this test
    if (searchParams.toString() === '' || (activeFilters.category === 'all' && activeFilters.occasion === 'all' && activeFilters.recipient === 'all')) {
        return "All Gifts";
    }

    let titleParts = [];
    if (activeFilters.occasion !== 'all') {
      const occasionObj = OCCASIONS_LIST.find(o => o.slug === activeFilters.occasion);
      if (occasionObj) titleParts.push(occasionObj.name);
    }
    if (activeFilters.category !== 'all') {
        const categoryObj = CATEGORIES.find(c => c.slug === activeFilters.category);
        if (categoryObj) titleParts.push(categoryObj.name);
    }
    if (activeFilters.recipient !== 'all') {
      const recipientObj = RECIPIENTS_LIST.find(r => r.slug === activeFilters.recipient);
      if (recipientObj) titleParts.push(`for ${recipientObj.name}`);
    }
    
    if (titleParts.length === 0) {
        return "Filtered Gifts"; // Should ideally not happen if searchParams not empty
    }

    const baseTitle = titleParts.join(" ");
    return baseTitle.toLowerCase().endsWith("gifts") ? baseTitle : baseTitle + " Gifts";
  };


  if (filteredAndSortedProducts.length === 0 && PRODUCTS.length > 0 && hasMounted) {
      // This should ideally not happen with filters removed, unless PRODUCTS is truly empty
      // or there's an issue with pagination/slicing that makes currentProducts empty.
      console.error(
        `[DIAGNOSTIC_EMPTY_LIST] filteredAndSortedProducts is empty (length 0), but PRODUCTS has length ${PRODUCTS.length}. This is unexpected with filters removed. Check sorting or pagination. Current Page: ${currentPage}`
      );
  }


  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <SectionTitle className="mb-4 sm:mb-6">{generatePageTitle()}</SectionTitle>
      
      <div className="space-y-6"> 
          <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border rounded-lg shadow-sm bg-secondary gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Showing {currentProducts.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}-{(Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length))} of {filteredAndSortedProducts.length} products
            </p>
            <ProductSortControl currentSort={sortOption} onSortChange={(newSort) => {setSortOption(newSort); setCurrentPage(1);}} />
          </div>

          <ProductList products={currentProducts} />

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} 
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const showPage = totalPages <= 7 || 
                                   pageNum === 1 || pageNum === totalPages || 
                                   (pageNum >= currentPage - 2 && pageNum <= currentPage + 2); 

                  if (showPage) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (totalPages > 7 && (pageNum === currentPage - 3 || pageNum === currentPage + 3)) {
                     return <PaginationItem key={`ellipsis-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
    </div>
  );
}
    

    

    

