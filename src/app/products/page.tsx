
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

console.log("[DIAGNOSTIC_TOP_LEVEL] PRODUCTS imported. Length:", PRODUCTS ? PRODUCTS.length : 'undefined');
if (PRODUCTS && PRODUCTS.length > 0) {
  console.log("[DIAGNOSTIC_TOP_LEVEL] First product ID from PRODUCTS:", PRODUCTS[0].id, "Name:", PRODUCTS[0].name, "Price:", PRODUCTS[0].price);
} else {
  console.warn("[DIAGNOSTIC_TOP_LEVEL] PRODUCTS array is empty or undefined at module scope! This is a critical issue if data.ts is populated.");
}

const ITEMS_PER_PAGE = 50;

interface ActiveFilters {
  category: string;
  priceRange: [number, number];
  occasion: string;
  recipient: string;
}

const calculateInitialMaxPrice = (products: Product[]): number => {
  if (!products || products.length === 0) {
    console.warn("[DIAGNOSTIC_CALC_MAX_PRICE] PRODUCTS array is empty during calculation. Defaulting max price to Number.MAX_SAFE_INTEGER.");
    return Number.MAX_SAFE_INTEGER;
  }
  const prices = products.map(p => p.price).filter(price => typeof price === 'number' && !isNaN(price));
  if (prices.length === 0) {
    console.warn("[DIAGNOSTIC_CALC_MAX_PRICE] No valid prices found in PRODUCTS. Defaulting max price to Number.MAX_SAFE_INTEGER.");
    return Number.MAX_SAFE_INTEGER;
  }
  const maxActualPrice = Math.max(...prices);
  const result = maxActualPrice > 0 ? maxActualPrice : Number.MAX_SAFE_INTEGER;
  console.log("[DIAGNOSTIC_CALC_MAX_PRICE] Calculated initialMaxPrice to be:", result);
  return result;
};

export default function ProductsPage() {
  console.log("[DIAGNOSTIC_RENDER] ProductsPage component rendering. Base PRODUCTS length:", PRODUCTS ? PRODUCTS.length : 'undefined');
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);

  // Calculate initialMaxPrice once on mount based on actual product data
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    setHasMounted(true);
    const calculatedMax = calculateInitialMaxPrice(PRODUCTS);
    setInitialMaxPrice(calculatedMax);
    console.log("[DIAGNOSTIC_MOUNT_EFFECT] Component mounted. InitialMaxPrice calculated and set to:", calculatedMax);
  }, []);


  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, Number.MAX_SAFE_INTEGER], // Initialize with widest possible range
    occasion: 'all',
    recipient: 'all',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Wait for mount and for initialMaxPrice to be calculated
    if (!hasMounted || initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0) {
        console.log(`[DIAGNOSTIC_URL_EFFECT] Skipping effect: hasMounted=${hasMounted}, initialMaxPrice=${initialMaxPrice}`);
        return;
    }

    console.log("[DIAGNOSTIC_URL_EFFECT] Running. searchParams:", searchParams.toString(), "Current initialMaxPrice:", initialMaxPrice);

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
        } else {
            console.warn(`[DIAGNOSTIC_URL_EFFECT] priceMinQuery '${priceMinQuery}' is invalid. Defaulting min to 0.`);
        }
    }

    let newMaxPrice = initialMaxPrice; // Default to the calculated initialMaxPrice
    if (priceMaxQuery !== null) {
        const parsedMax = parseInt(priceMaxQuery, 10);
        // Ensure parsedMax is a valid number and not less than newMinPrice
        if (!isNaN(parsedMax) && parsedMax >= newMinPrice) { 
            newMaxPrice = parsedMax;
        } else if (!isNaN(parsedMax) && parsedMax < newMinPrice && newMinPrice > 0) { // If max is less than min (and min is not 0)
            console.warn(`[DIAGNOSTIC_URL_EFFECT] priceMaxQuery '${priceMaxQuery}' is less than newMinPrice '${newMinPrice}'. Setting max to initialMaxPrice.`);
            newMaxPrice = initialMaxPrice; // Use a wide range if max is invalid relative to min
        } else if (isNaN(parsedMax)) {
             console.warn(`[DIAGNOSTIC_URL_EFFECT] priceMaxQuery '${priceMaxQuery}' is NaN. Defaulting max to initialMaxPrice.`);
        }
    }
    
    // Safety Net: Reset if range is invalid or max is 0 when it shouldn't be
    if (newMinPrice > newMaxPrice || (newMaxPrice === 0 && initialMaxPrice > 0) || isNaN(newMinPrice) || isNaN(newMaxPrice)) {
        console.warn(`[DIAGNOSTIC_URL_EFFECT] Corrected invalid price range. Resetting to [0, ${initialMaxPrice}]. Initial attempt: [${newMinPrice}, ${newMaxPrice}]`);
        newMinPrice = 0; 
        newMaxPrice = initialMaxPrice;
    }
    
    const newFilters: ActiveFilters = {
        category: categoryFromUrl,
        priceRange: [newMinPrice, newMaxPrice],
        occasion: occasionFromUrl,
        recipient: recipientFromUrl,
    };

    // Only update state if there's an actual change to avoid infinite loops
    const filtersChanged = JSON.stringify(activeFilters) !== JSON.stringify(newFilters);
    const sortChanged = sortOption !== sortFromUrl;

    if (filtersChanged) {
      console.log("[DIAGNOSTIC_URL_EFFECT] Setting new activeFilters from URL:", newFilters);
      setActiveFilters(newFilters);
      setCurrentPage(1); // Reset page if filters change
    } else {
       console.log("[DIAGNOSTIC_URL_EFFECT] No change in activeFilters needed from URL.");
    }
    
    if (sortChanged) {
      console.log(`[DIAGNOSTIC_URL_EFFECT] Updating sortOption from '${sortOption}' to '${sortFromUrl}'`);
      setSortOption(sortFromUrl);
      if (!filtersChanged) setCurrentPage(1); // Reset page if only sort changes
    }

  }, [searchParams, hasMounted, initialMaxPrice, activeFilters, sortOption]);


  const filteredAndSortedProducts = useMemo(() => {
    console.log("[DIAGNOSTIC_FILTER_MEMO] Recalculating filteredAndSortedProducts.");
    console.log("[DIAGNOSTIC_FILTER_MEMO] Base PRODUCTS length:", PRODUCTS ? PRODUCTS.length : 'undefined');
    console.log("[DIAGNOSTIC_FILTER_MEMO] Current activeFilters:", activeFilters);
    console.log("[DIAGNOSTIC_FILTER_MEMO] Current initialMaxPrice (for reference in price filter):", initialMaxPrice);


    if (!PRODUCTS || PRODUCTS.length === 0) {
      console.warn("[DIAGNOSTIC_FILTER_MEMO] PRODUCTS array is empty or undefined at start of memo. Returning empty array.");
      return [];
    }

    let tempProducts = [...PRODUCTS];
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Initial product count: ${tempProducts.length}`);

    // Apply category filter
    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After category filter ('${activeFilters.category}'): ${tempProducts.length} products`);
    }

    // Apply occasion filter
    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion?.includes(activeFilters.occasion));
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After occasion filter ('${activeFilters.occasion}'): ${tempProducts.length} products`);
    }

    // Apply recipient filter
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient?.includes(activeFilters.recipient));
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After recipient filter ('${activeFilters.recipient}'): ${tempProducts.length} products`);
    }

    // Apply price range filter
    const [minPrice, maxPrice] = activeFilters.priceRange;
    // Ensure minPrice and maxPrice are valid numbers before filtering
    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && !isNaN(minPrice) && !isNaN(maxPrice) && minPrice <= maxPrice) {
        if (minPrice > 0 || maxPrice < initialMaxPrice) { // Only apply if not the default widest range
            tempProducts = tempProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
            console.log(`[DIAGNOSTIC_FILTER_MEMO] After price filter ([${minPrice}, ${maxPrice}]): ${tempProducts.length} products`);
        }
    } else {
        console.warn(`[DIAGNOSTIC_FILTER_MEMO] Invalid priceRange in activeFilters: [${minPrice}, ${maxPrice}]. Skipping price filter.`);
    }
    
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Products before sorting: ${tempProducts.length}. Sort option: ${sortOption}`);
    // Apply sorting
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
        console.warn(`[DIAGNOSTIC_FILTER_MEMO] Invalid sortOption: '${sortOption}'. Defaulting to popularity.`);
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    console.log(`[DIAGNOSTIC_FILTER_MEMO] After sorting by '${sortOption}', final count for memo: ${tempProducts.length}`);
    return tempProducts;

  }, [activeFilters, sortOption, initialMaxPrice]); 
  
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
    let titleParts = [];
    if (activeFilters.occasion !== 'all') {
      const occasionObj = OCCASIONS_LIST.find(o => o.slug === activeFilters.occasion);
      if (occasionObj) titleParts.push(occasionObj.name);
    }
    if (activeFilters.category !== 'all') {
        const categoryObj = CATEGORIES.find(c => c.slug === activeFilters.category); // Using CATEGORIES (alias for GIFT_TYPES_LIST)
        if (categoryObj) titleParts.push(categoryObj.name);
    }
    if (activeFilters.recipient !== 'all') {
      const recipientObj = RECIPIENTS_LIST.find(r => r.slug === activeFilters.recipient);
      if (recipientObj) titleParts.push(`for ${recipientObj.name}`);
    }
    
    if (titleParts.length === 0 && searchParams.toString() === '') { // Default page with no URL params
        return "All Gifts";
    } else if (titleParts.length === 0 && searchParams.toString() !== '') { // Has URL params but they didn't match known filters for title
        return "Filtered Gifts";
    }

    const baseTitle = titleParts.join(" ");
    // Ensure "Gifts" is appended intelligently, avoiding "Gifts Gifts"
    return baseTitle.toLowerCase().endsWith("gifts") ? baseTitle : baseTitle + " Gifts";
  };

  // More detailed check for "No products found" scenario
  if (PRODUCTS && PRODUCTS.length > 0 && currentProducts.length === 0 && filteredAndSortedProducts.length === 0) {
    console.error("[DIAGNOSTIC_RENDER_ISSUE] PRODUCTS array is populated, but no products are displayed. Active Filters:", activeFilters, "Initial Max Price:", initialMaxPrice, "Current Sort:", sortOption);
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
                  // Simplified pagination display logic for brevity
                  const showPage = totalPages <= 7 || // Show all if 7 or less pages
                                   pageNum === 1 || pageNum === totalPages || // Always show first and last
                                   (pageNum >= currentPage - 2 && pageNum <= currentPage + 2); // Show current and 2 adjacent on each side

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
                     // Show ellipsis if conditions met
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
    

    

    