
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

console.log("[DIAGNOSTIC] Top-level: PRODUCTS imported. Length:", PRODUCTS ? PRODUCTS.length : 'undefined');

const ITEMS_PER_PAGE = 50; 

interface ActiveFilters { 
  category: string;
  priceRange: [number, number];
  occasion: string;
  recipient: string;
}

export default function ProductsPage() {
  console.log("[DIAGNOSTIC] ProductsPage rendered. Initial PRODUCTS length from within component:", PRODUCTS ? PRODUCTS.length : 'undefined');

  const searchParams = useSearchParams();

  const serverMaxPrice = useMemo(() => {
    if (!PRODUCTS || PRODUCTS.length === 0) {
        console.warn("[DIAGNOSTIC] serverMaxPrice: PRODUCTS array is empty or undefined during calculation.");
        return Number.MAX_SAFE_INTEGER;
    }
    const prices = PRODUCTS.map(p => p.price).filter(p => typeof p.price === 'number' && !isNaN(p.price));
    if (prices.length === 0) {
        console.warn("[DIAGNOSTIC] serverMaxPrice: No valid prices found in PRODUCTS.");
        return Number.MAX_SAFE_INTEGER;
    }
    const maxProductPrice = Math.max(...prices);
    const result = maxProductPrice > 0 ? maxProductPrice : Number.MAX_SAFE_INTEGER;
    console.log("[DIAGNOSTIC] serverMaxPrice calculated:", result);
    return result;
  }, []);

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, Number.MAX_SAFE_INTEGER], 
    occasion: 'all',
    recipient: 'all',
  });
  console.log("[DIAGNOSTIC] Initial activeFilters state:", activeFilters);
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("[DIAGNOSTIC] useEffect for searchParams triggered. searchParams:", searchParams.toString());
    console.log("[DIAGNOSTIC] useEffect: serverMaxPrice available:", serverMaxPrice);

    const categoryFromUrl = searchParams.get('category') || 'all';
    const occasionFromUrl = searchParams.get('occasion') || 'all';
    const recipientFromUrl = searchParams.get('recipient') || 'all';
    const sortFromUrl = (searchParams.get('sort') as SortOption) || 'popularity';

    const priceMinQuery = searchParams.get('priceMin');
    const priceMaxQuery = searchParams.get('priceMax');
    console.log(`[DIAGNOSTIC] useEffect: priceMinQuery='${priceMinQuery}', priceMaxQuery='${priceMaxQuery}'`);

    let newMinPrice = 0;
    if (priceMinQuery !== null) {
        const parsed = parseInt(priceMinQuery, 10);
        if (!isNaN(parsed)) {
            newMinPrice = parsed;
        } else {
            console.warn(`[DIAGNOSTIC] useEffect: priceMinQuery '${priceMinQuery}' is NaN. Defaulting to 0.`);
        }
    }

    let newMaxPrice = serverMaxPrice; 
    if (priceMaxQuery !== null) {
        const parsed = parseInt(priceMaxQuery, 10);
        if (!isNaN(parsed)) {
            newMaxPrice = Math.min(parsed, serverMaxPrice); // Ensure it doesn't exceed actual max
        } else {
            console.warn(`[DIAGNOSTIC] useEffect: priceMaxQuery '${priceMaxQuery}' is NaN. Defaulting to serverMaxPrice.`);
        }
    }
    
    if (newMinPrice > newMaxPrice) {
        console.warn(`[DIAGNOSTIC] useEffect: newMinPrice (${newMinPrice}) > newMaxPrice (${newMaxPrice}). Resetting to defaults [0, ${serverMaxPrice}].`);
        newMinPrice = 0; 
        newMaxPrice = serverMaxPrice;
    }
    
    const newFilters = {
        category: categoryFromUrl,
        priceRange: [newMinPrice, newMaxPrice] as [number, number],
        occasion: occasionFromUrl,
        recipient: recipientFromUrl,
    };
    console.log("[DIAGNOSTIC] useEffect: Setting new activeFilters:", newFilters);
    setActiveFilters(newFilters);
    setSortOption(sortFromUrl); 
    setCurrentPage(1); 
  }, [searchParams, serverMaxPrice]);


  const filteredAndSortedProducts = useMemo(() => {
    console.log("[DIAGNOSTIC] useMemo for filteredAndSortedProducts: Base PRODUCTS length:", PRODUCTS ? PRODUCTS.length : 'undefined');
    console.log("[DIAGNOSTIC] useMemo: current activeFilters:", activeFilters);
    console.log("[DIAGNOSTIC] useMemo: current sortOption:", sortOption);

    if (!PRODUCTS || PRODUCTS.length === 0) {
      console.warn("[DIAGNOSTIC] filteredAndSortedProducts: PRODUCTS array is empty or undefined at start of memo.");
      return [];
    }

    let tempProducts = [...PRODUCTS];
    console.log(`[DIAGNOSTIC] Initial tempProducts count: ${tempProducts.length}`);

    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
      console.log(`[DIAGNOSTIC] After category filter ('${activeFilters.category}'), count: ${tempProducts.length}`);
    }

    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion?.includes(activeFilters.occasion));
      console.log(`[DIAGNOSTIC] After occasion filter ('${activeFilters.occasion}'), count: ${tempProducts.length}`);
    }
    
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient?.includes(activeFilters.recipient));
      console.log(`[DIAGNOSTIC] After recipient filter ('${activeFilters.recipient}'), count: ${tempProducts.length}`);
    }
    
    const minPrice = activeFilters.priceRange[0];
    const maxPrice = activeFilters.priceRange[1];

    if (typeof minPrice !== 'number' || isNaN(minPrice) || typeof maxPrice !== 'number' || isNaN(maxPrice)) {
      console.error("[DIAGNOSTIC] filteredAndSortedProducts: Critical error: Invalid priceRange in activeFilters:", activeFilters.priceRange);
      return []; 
    }
    
    tempProducts = tempProducts.filter(p => {
        if (typeof p.price !== 'number' || isNaN(p.price)) {
          console.warn(`[DIAGNOSTIC] Product ID ${p.id} has invalid price: ${p.price}. Filtering out.`);
          return false; 
        }
        return p.price >= minPrice && p.price <= maxPrice;
    });
    console.log(`[DIAGNOSTIC] After price filter ([${minPrice}, ${maxPrice}]), count: ${tempProducts.length}`);
    
    switch (sortOption) {
      case 'popularity':
        tempProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'price_asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    console.log(`[DIAGNOSTIC] After sorting by '${sortOption}', count: ${tempProducts.length}`);
        
    if (sortOption === 'trending') { 
       tempProducts = tempProducts.filter(p => p.trending).sort((a,b) => b.popularity - a.popularity);
       console.log(`[DIAGNOSTIC] After trending filter & sort, count: ${tempProducts.length}`);
    }

    console.log(`[DIAGNOSTIC] Final filteredAndSortedProducts count: ${tempProducts.length}`);
    return tempProducts;
  }, [activeFilters, sortOption]); 

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  console.log(`[DIAGNOSTIC] currentProducts for page ${currentPage}: ${currentProducts.length} items. Total pages: ${totalPages}`);

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
    return titleParts.join(" ") + (titleParts.length > 0 ? " Gifts" : "");
  };

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
                  const showPage = pageNum === 1 || 
                                   pageNum === totalPages || 
                                   pageNum === currentPage || 
                                   (pageNum >= currentPage - 1 && pageNum <= currentPage + 1 && totalPages <= 5) || 
                                   (totalPages > 5 && (pageNum === currentPage -1 || pageNum === currentPage + 1)); 
                  
                  const showEllipsisBefore = totalPages > 5 && pageNum === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = totalPages > 5 && pageNum === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore) {
                    return <PaginationItem key={`ellipsis-before-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                  }
                   if (showEllipsisAfter) {
                    return <PaginationItem key={`ellipsis-after-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
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
