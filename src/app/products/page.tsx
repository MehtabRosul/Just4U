
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST } from '@/lib/data';

const ITEMS_PER_PAGE = 12;

interface ActiveFilters {
  category: string;
  occasion: string;
  recipient: string;
  priceRange: [number, number];
}

const calculateMaxProductPrice = () => {
    if (!PRODUCTS || PRODUCTS.length === 0) {
        return 5000;
    }
    const max = Math.max(...PRODUCTS.map(p => p.price || 0));
    return max > 0 ? Math.ceil(max / 100) * 100 : 5000;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(calculateMaxProductPrice());
  const [hasMounted, setHasMounted] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    occasion: 'all',
    recipient: 'all',
    priceRange: [0, initialMaxPrice],
  });

  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const maxPrice = calculateMaxProductPrice();
    setInitialMaxPrice(maxPrice);
    setActiveFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const newCategory = searchParams.get('category') || 'all';
    const newOccasion = searchParams.get('occasion') || 'all';
    const newRecipient = searchParams.get('recipient') || 'all';
    const newSort = (searchParams.get('sort') as SortOption) || 'popularity';

    const newMinPrice = parseInt(searchParams.get('priceMin') || '0', 10);
    const newMaxPrice = parseInt(searchParams.get('priceMax') || `${initialMaxPrice}`, 10);
    
    const validMinPrice = !isNaN(newMinPrice) ? newMinPrice : 0;
    const validMaxPrice = !isNaN(newMaxPrice) && newMaxPrice > 0 ? newMaxPrice : initialMaxPrice;

    setActiveFilters({
      category: newCategory,
      occasion: newOccasion,
      recipient: newRecipient,
      priceRange: [validMinPrice, validMaxPrice],
    });
    
    setSortOption(newSort);
    setCurrentPage(1); // Reset page on filter change

  }, [searchParams, hasMounted, initialMaxPrice]);

  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...PRODUCTS];

    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
    }
    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion?.includes(activeFilters.occasion));
    }
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient?.includes(activeFilters.recipient));
    }
    
    // Price filter
    tempProducts = tempProducts.filter(
        p => p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]
    );

    switch (sortOption) {
      case 'popularity': tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
      case 'price_asc': tempProducts.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price_desc': tempProducts.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name_asc': tempProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': tempProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      default:
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    
    return tempProducts;
  }, [activeFilters, sortOption]);
  
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
  
  const generatePageTitle = useCallback(() => {
    if (activeFilters.category !== 'all') {
      return GIFT_TYPES_LIST.find(c => c.slug === activeFilters.category)?.name || "Gifts";
    }
    if (activeFilters.occasion !== 'all') {
      return OCCASIONS_LIST.find(o => o.slug === activeFilters.occasion)?.name || "Gifts";
    }
    return "All Gifts";
  }, [activeFilters]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <SectionTitle className="mb-4 sm:mb-6">{generatePageTitle()}</SectionTitle>
      
      <div className="space-y-6"> 
          <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border rounded-lg shadow-sm bg-secondary gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Showing {filteredAndSortedProducts.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}-{(Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length))} of {filteredAndSortedProducts.length} products
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

    