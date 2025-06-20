
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
// import { ProductFilters, type Filters as ProductFilterInputs } from '@/components/products/ProductFilters'; // Removed
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 50; 

interface ActiveFilters { 
  category: string;
  priceRange: [number, number];
  occasion: string;
  recipient: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const serverMaxPrice = useMemo(() => {
    if (PRODUCTS.length === 0) return 1000;
    return Math.max(...PRODUCTS.map(p => p.price), 0);
  }, []);

  const initialCategory = searchParams.get('category') || 'all'; 
  const initialOccasion = searchParams.get('occasion') || 'all';
  const initialRecipient = searchParams.get('recipient') || 'all';
  const initialPriceMin = parseInt(searchParams.get('priceMin') || '0', 10);
  const initialPriceMaxQuery = searchParams.get('priceMax');
  const initialPriceMax = initialPriceMaxQuery !== null ? parseInt(initialPriceMaxQuery, 10) : serverMaxPrice;
  
  const initialSortQuery = searchParams.get('sort');
  const initialSort = (initialSortQuery as SortOption) || 'popularity';


  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: initialCategory,
    priceRange: [initialPriceMin, Math.min(initialPriceMax, serverMaxPrice)],
    occasion: initialOccasion,
    recipient: initialRecipient,
  });
  
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const newCategory = searchParams.get('category') || 'all';
    const newOccasion = searchParams.get('occasion') || 'all';
    const newRecipient = searchParams.get('recipient') || 'all';
    const newPriceMin = parseInt(searchParams.get('priceMin') || '0', 10);
    const newPriceMaxQuery = searchParams.get('priceMax');
    const newPriceMax = newPriceMaxQuery !== null ? parseInt(newPriceMaxQuery, 10) : serverMaxPrice;
    const newSort = (searchParams.get('sort') as SortOption) || 'popularity';

    setActiveFilters({
        category: newCategory,
        priceRange: [newPriceMin, Math.min(newPriceMax, serverMaxPrice)],
        occasion: newOccasion,
        recipient: newRecipient,
    });
    setSortOption(newSort); 
    setCurrentPage(1); 
  }, [searchParams, serverMaxPrice]);


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

    tempProducts = tempProducts.filter(p => p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]);

    
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
    
    
    if (sortOption === 'trending') { 
       tempProducts = tempProducts.filter(p => p.trending).sort((a,b) => b.popularity - a.popularity);
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
                                   pageNum === currentPage - 1 || 
                                   pageNum === currentPage + 1;
                  
                  const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3 && totalPages > 5;
                  const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2 && totalPages > 5;

                  if (showEllipsisBefore && pageNum > 1 && pageNum < currentPage -1) {
                    return <PaginationItem key={`ellipsis-before-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                  }
                   if (showEllipsisAfter && pageNum < totalPages && pageNum > currentPage + 1) {
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
    </div>
  );
}




