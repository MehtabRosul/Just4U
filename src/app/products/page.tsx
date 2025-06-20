
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

const calculateMaxProductPrice = (products: Product[]): number => {
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

  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    setHasMounted(true);
    const calculatedMax = calculateMaxProductPrice(PRODUCTS);
    setInitialMaxPrice(calculatedMax);
    console.log("[DIAGNOSTIC_MOUNT_EFFECT] Component mounted. InitialMaxPrice calculated and set to:", calculatedMax);
  }, []);


  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, Number.MAX_SAFE_INTEGER], 
    occasion: 'all',
    recipient: 'all',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!hasMounted || initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0) { // Ensure initialMaxPrice is realistically set before proceeding
        console.log(`[DIAGNOSTIC_URL_EFFECT] Skipping effect: hasMounted=${hasMounted}, initialMaxPrice=${initialMaxPrice}`);
        if (initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0 && hasMounted) {
             // This condition suggests initialMaxPrice might not have updated from its default MAX_SAFE_INTEGER
             // to a calculated one if calculateMaxProductPrice was still running or yielded MAX_SAFE_INTEGER.
             // Re-calculate or use a safe default if initialMaxPrice seems off.
            const recalcMaxPrice = calculateMaxProductPrice(PRODUCTS);
            if (initialMaxPrice !== recalcMaxPrice) { // If it's different, update and log
                console.warn(`[DIAGNOSTIC_URL_EFFECT] initialMaxPrice was MAX_SAFE_INTEGER, recalculating to ${recalcMaxPrice}. Consider if initial calculation is completing correctly.`);
                 // Potentially setInitialMaxPrice(recalcMaxPrice) here if confident, or just use recalcMaxPrice for current op.
            }
        }
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
        if (!isNaN(parsedMax) && parsedMax >= 0) {
            newMaxPrice = parsedMax;
        } else {
            console.warn(`[DIAGNOSTIC_URL_EFFECT] priceMaxQuery '${priceMaxQuery}' is invalid. Defaulting max to initialMaxPrice (${initialMaxPrice}).`);
        }
    }
    
    // Safety Net: Reset if range is invalid
    if (newMinPrice > newMaxPrice || (newMaxPrice === 0 && initialMaxPrice > 0) || isNaN(newMinPrice) || isNaN(newMaxPrice)) {
        console.warn(`[DIAGNOSTIC_URL_EFFECT] Invalid price range detected (min: ${newMinPrice}, max: ${newMaxPrice}, initialMax: ${initialMaxPrice}). Resetting to [0, ${initialMaxPrice}].`);
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
    if (JSON.stringify(activeFilters) !== JSON.stringify(newFilters)) {
      console.log("[DIAGNOSTIC_URL_EFFECT] Setting new activeFilters:", newFilters);
      setActiveFilters(newFilters);
    }
    
    if (sortOption !== sortFromUrl) {
      console.log(`[DIAGNOSTIC_URL_EFFECT] Updating sortOption from '${sortOption}' to '${sortFromUrl}'`);
      setSortOption(sortFromUrl);
    }
    setCurrentPage(1); // Reset to page 1 on any filter/sort change from URL
  }, [searchParams, hasMounted, initialMaxPrice]); // activeFilters removed to prevent loop, sortOption removed as it's set directly


  const filteredAndSortedProducts = useMemo(() => {
    console.log("[DIAGNOSTIC_FILTER_MEMO] Recalculating filteredAndSortedProducts.");
    console.log("[DIAGNOSTIC_FILTER_MEMO] Base PRODUCTS length:", PRODUCTS ? PRODUCTS.length : 'undefined');

    if (!PRODUCTS || PRODUCTS.length === 0) {
      console.warn("[DIAGNOSTIC_FILTER_MEMO] PRODUCTS array is empty or undefined at start of memo. Returning empty array.");
      return [];
    }

    // TEMPORARILY BYPASS ALL FILTERS EXCEPT SORTING
    // This is to isolate whether the display mechanism itself is working.
    let productsToDisplay = [...PRODUCTS]; // Start with a copy of all products
    console.log(`[DIAGNOSTIC_FILTER_MEMO] (TEMPORARILY BYPASSING FILTERS) Initial product count: ${productsToDisplay.length}`);
    console.log("[DIAGNOSTIC_FILTER_MEMO] Current sortOption:", sortOption);

    // Apply sorting to the full list of products
    switch (sortOption) {
      case 'popularity': productsToDisplay.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
      case 'price_asc': productsToDisplay.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price_desc': productsToDisplay.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name_asc': productsToDisplay.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': productsToDisplay.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'trending':
        productsToDisplay.sort((a, b) => {
          const trendingA = a.trending ? 1 : 0;
          const trendingB = b.trending ? 1 : 0;
          if (trendingB !== trendingA) {
            return trendingB - trendingA; // Trending items first
          }
          return (b.popularity || 0) - (a.popularity || 0); // Then by popularity
        });
        break;
      default:
        console.warn(`[DIAGNOSTIC_FILTER_MEMO] Invalid sortOption: '${sortOption}'. Defaulting to popularity.`);
        productsToDisplay.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    console.log(`[DIAGNOSTIC_FILTER_MEMO] After sorting by '${sortOption}', final count for memo: ${productsToDisplay.length}`);
    return productsToDisplay;

  }, [sortOption]); // Only re-calculate when sortOption changes. PRODUCTS is a top-level constant.
  
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
        const categoryObj = CATEGORIES.find(c => c.slug === activeFilters.category);
        if (categoryObj) titleParts.push(categoryObj.name);
    }
    if (activeFilters.recipient !== 'all') {
      const recipientObj = RECIPIENTS_LIST.find(r => r.slug === activeFilters.recipient);
      if (recipientObj) titleParts.push(`for ${recipientObj.name}`);
    }
    
    // Even if filters are bypassed for display, title should reflect attempted navigation
    if (titleParts.length === 0 && searchParams.toString() === '') {
        return "All Gifts";
    } else if (titleParts.length === 0 && searchParams.toString() !== '') {
        // If URL has params but they don't match known occasions/categories/recipients for title
        return "Filtered Gifts";
    }

    const baseTitle = titleParts.join(" ");
    return baseTitle.endsWith("Gifts") ? baseTitle : baseTitle + " Gifts";
  };

  if (PRODUCTS && PRODUCTS.length > 0 && currentProducts.length === 0 && filteredAndSortedProducts.length === 0) {
    // This condition is now less likely with bypassed filters, but good to keep for general debugging
    console.error("[DIAGNOSTIC_RENDER_ISSUE] All filters are 'all'/max range (or bypassed), PRODUCTS array is populated, but no products are displayed. This indicates a deeper issue in data loading, ProductCard rendering, or ProductList itself.");
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
                                   (pageNum >= currentPage - 1 && pageNum <= currentPage + 1); // Show current and adjacent

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
                  } else if (totalPages > 7 && (pageNum === currentPage - 2 || pageNum === currentPage + 2)) {
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
    

    