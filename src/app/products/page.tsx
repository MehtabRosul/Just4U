
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

// Minimal console logs for essential diagnostics
console.log(`[DIAGNOSTIC_TOP_LEVEL] PRODUCTS imported. Length: ${PRODUCTS.length}`);
if (PRODUCTS.length > 0) {
  console.log(`[DIAGNOSTIC_TOP_LEVEL] First product ID from PRODUCTS: ${PRODUCTS[0].id} Name: ${PRODUCTS[0].name} Price: ${PRODUCTS[0].price}`);
}


export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    console.log(`[DIAGNOSTIC_URL_EFFECT] Running. searchParams: ${searchParams.toString()}`);
    
    const sortFromUrl = (searchParams.get('sort') as SortOption) || 'popularity';
    
    let needsReset = false;

    if (sortOption !== sortFromUrl) {
      setSortOption(sortFromUrl);
      needsReset = true;
      console.log(`[DIAGNOSTIC_URL_EFFECT] Sort option changed to: ${sortFromUrl}`);
    }

    if (needsReset) {
      setCurrentPage(1);
      console.log(`[DIAGNOSTIC_URL_EFFECT] Resetting current page to 1`);
    }

  }, [searchParams, hasMounted, sortOption]);


  const filteredAndSortedProducts = useMemo(() => {
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Recalculating filteredAndSortedProducts.`);
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Base PRODUCTS length: ${PRODUCTS.length}`);
    
    let tempProducts = [...PRODUCTS]; // Start with all products

    console.log(`[DIAGNOSTIC_FILTER_MEMO] Initial product count (all products): ${tempProducts.length}`);
    
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
          if (trendingB !== trendingA) return trendingB - trendingA; 
          return (b.popularity || 0) - (a.popularity || 0); 
        });
        break;
      default:
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    console.log(`[DIAGNOSTIC_FILTER_MEMO] After sorting by '${sortOption}', final count for memo: ${tempProducts.length}`);
    return tempProducts;

  }, [sortOption]); // Dependency only on sortOption as no other filters are applied
  
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); 
    }
  };
  
  const generatePageTitle = () => {
    return "All Gifts"; // Generic title as no filters are applied
  };

  console.log(`[DIAGNOSTIC_RENDER] currentProducts for page ${currentPage}: ${currentProducts.length} items. Total pages: ${totalPages}. Total in filteredAndSortedProducts: ${filteredAndSortedProducts.length}`);

  if (filteredAndSortedProducts.length === 0 && PRODUCTS.length > 0 && hasMounted) {
      console.error(
        `[DIAGNOSTIC_RENDER_ISSUE] PRODUCTS array has ${PRODUCTS.length} items, but no products are displayed after sorting. Current Sort: ${sortOption}`
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
