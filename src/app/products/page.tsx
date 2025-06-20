
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

  const initialMaxPrice = useMemo(() => {
    return calculateMaxProductPrice(PRODUCTS);
  }, []); // Calculate once based on static PRODUCTS

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, Number.MAX_SAFE_INTEGER], // Start with widest possible range
    occasion: 'all',
    recipient: 'all',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // This effect updates filters based on URL search parameters.
    // It relies on initialMaxPrice being stable after the first calculation.
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

    // Default newMaxPrice to initialMaxPrice (which itself defaults to MAX_SAFE_INTEGER if no products/prices)
    let newMaxPrice = initialMaxPrice; 
    if (priceMaxQuery !== null) {
        const parsedMax = parseInt(priceMaxQuery, 10);
        // Use parsedMax only if it's a valid number and non-negative
        if (!isNaN(parsedMax) && parsedMax >= 0) {
            newMaxPrice = parsedMax;
        } else {
            console.warn(`[DIAGNOSTIC_URL_EFFECT] priceMaxQuery '${priceMaxQuery}' is invalid. Defaulting max to initialMaxPrice (${initialMaxPrice}).`);
        }
    }
    
    // Critical Safety Net: Ensure the price range is valid.
    // If newMaxPrice ended up as 0 (and initialMaxPrice is much larger), or min > max, reset.
    if (newMinPrice > newMaxPrice || (newMaxPrice === 0 && initialMaxPrice > 0)) {
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
    console.log("[DIAGNOSTIC_URL_EFFECT] Setting new activeFilters:", newFilters);
    setActiveFilters(newFilters);
    
    if (sortOption !== sortFromUrl) {
      console.log(`[DIAGNOSTIC_URL_EFFECT] Updating sortOption from '${sortOption}' to '${sortFromUrl}'`);
      setSortOption(sortFromUrl);
    }
    setCurrentPage(1);
  }, [searchParams, initialMaxPrice, sortOption]); // sortOption included because if it changes, we reset to page 1.


  const filteredAndSortedProducts = useMemo(() => {
    console.log("[DIAGNOSTIC_FILTER_MEMO] Recalculating filteredAndSortedProducts.");
    console.log("[DIAGNOSTIC_FILTER_MEMO] Base PRODUCTS length:", PRODUCTS ? PRODUCTS.length : 'undefined');

    if (!PRODUCTS || PRODUCTS.length === 0) {
      console.warn("[DIAGNOSTIC_FILTER_MEMO] PRODUCTS array is empty or undefined at start of memo. Returning empty array.");
      return [];
    }

    console.log("[DIAGNOSTIC_FILTER_MEMO] Current activeFilters:", activeFilters);
    console.log("[DIAGNOSTIC_FILTER_MEMO] Current sortOption:", sortOption);

    let tempProducts = [...PRODUCTS];
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Initial tempProducts count: ${tempProducts.length}`);

    // Category Filter
    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After category filter ('${activeFilters.category}'), count: ${tempProducts.length}`);
    }

    // Occasion Filter
    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion?.includes(activeFilters.occasion));
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After occasion filter ('${activeFilters.occasion}'), count: ${tempProducts.length}`);
    }
    
    // Recipient Filter
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient?.includes(activeFilters.recipient));
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After recipient filter ('${activeFilters.recipient}'), count: ${tempProducts.length}`);
    }
    
    // Price Filter
    const minPrice = activeFilters.priceRange[0];
    const maxPrice = activeFilters.priceRange[1];

    if (typeof minPrice !== 'number' || isNaN(minPrice) || typeof maxPrice !== 'number' || isNaN(maxPrice)) {
      console.error("[DIAGNOSTIC_FILTER_MEMO] CRITICAL: Invalid priceRange in activeFilters:", activeFilters.priceRange, ". Price filter effectively skipped for safety.");
    } else {
      console.log(`[DIAGNOSTIC_FILTER_MEMO] Applying price filter: min=${minPrice}, max=${maxPrice}`);
      tempProducts = tempProducts.filter(p => {
          if (typeof p.price !== 'number' || isNaN(p.price)) {
            console.warn(`[DIAGNOSTIC_FILTER_MEMO] Product ID ${p.id} (name: ${p.name}) has invalid price: ${p.price}. Filtering out.`);
            return false; 
          }
          return p.price >= minPrice && p.price <= maxPrice;
      });
      console.log(`[DIAGNOSTIC_FILTER_MEMO] After price filter ([${minPrice}, ${maxPrice}]), count: ${tempProducts.length}`);
    }
    
    let sortedProducts = [...tempProducts];
    if (sortOption === 'trending') { 
       sortedProducts = sortedProducts.filter(p => p.trending).sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
    } else {
        switch (sortOption) {
          case 'popularity': sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
          case 'price_asc': sortedProducts.sort((a, b) => a.price - b.price); break;
          case 'price_desc': sortedProducts.sort((a, b) => b.price - a.price); break;
          case 'name_asc': sortedProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
          case 'name_desc': sortedProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
          default:
            console.warn(`[DIAGNOSTIC_FILTER_MEMO] Invalid sortOption: '${sortOption}'. Defaulting to popularity.`);
            sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); 
            break;
        }
    }
    console.log(`[DIAGNOSTIC_FILTER_MEMO] After sorting by '${sortOption}', final count for memo: ${sortedProducts.length}`);
    return sortedProducts;

  }, [activeFilters, sortOption]); 
  
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log(`[DIAGNOSTIC_RENDER] currentProducts for page ${currentPage}: ${currentProducts.length} items. Total pages: ${totalPages}. Total filtered: ${filteredAndSortedProducts.length}`);

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
    if (titleParts.length === 0) return "All Gifts";
    const baseTitle = titleParts.join(" ");
    return baseTitle.endsWith("Gifts") ? baseTitle : baseTitle + " Gifts";
  };

  if (PRODUCTS && PRODUCTS.length > 0 && currentProducts.length === 0 && filteredAndSortedProducts.length === 0 && activeFilters.category === 'all' && activeFilters.occasion === 'all' && activeFilters.recipient === 'all' && activeFilters.priceRange[0] === 0 && activeFilters.priceRange[1] === Number.MAX_SAFE_INTEGER) {
    console.error("[DIAGNOSTIC_RENDER_ISSUE] All filters are 'all'/max range, PRODUCTS array is populated, but no products are displayed. This indicates a deeper issue in filtering logic or data integrity within PRODUCTS (e.g. invalid prices for all items).");
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
                  const showEllipsis = totalPages > 5 && (pageNum > 2 && pageNum < currentPage - 1 || pageNum < totalPages -1 && pageNum > currentPage + 1);
                  const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage -1 && pageNum <= currentPage + 1);

                  if (showEllipsis && pageNum === currentPage - 2) {
                     return <PaginationItem key={`ellipsis-start-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                  }
                  if (showEllipsis && pageNum === currentPage + 2 ) {
                     return <PaginationItem key={`ellipsis-end-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                  }
                 
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

    