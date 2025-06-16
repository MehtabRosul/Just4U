
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters, type Filters as ProductFilterInputs } from '@/components/products/ProductFilters';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

interface ActiveFilters extends ProductFilterInputs {
  occasion: string;
  recipient: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const serverMaxPrice = useMemo(() => {
    if (PRODUCTS.length === 0) return 1000;
    return Math.max(...PRODUCTS.map(p => p.price), 0);
  }, []);

  const initialCategory = searchParams.get('category') || 'all'; // For gift type
  const initialOccasion = searchParams.get('occasion') || 'all';
  const initialRecipient = searchParams.get('recipient') || 'all';
  const initialPriceMin = parseInt(searchParams.get('priceMin') || '0', 10);
  const initialPriceMaxQuery = searchParams.get('priceMax');
  const initialPriceMax = initialPriceMaxQuery !== null ? parseInt(initialPriceMaxQuery, 10) : serverMaxPrice;
  
  const initialSort = (searchParams.get('sort') as SortOption) || 'popularity';

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: initialCategory,
    priceRange: [initialPriceMin, Math.min(initialPriceMax, serverMaxPrice)],
    occasion: initialOccasion,
    recipient: initialRecipient,
  });
  
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Update filters if searchParams change (e.g., browser back/forward)
    const newCategory = searchParams.get('category') || 'all';
    const newOccasion = searchParams.get('occasion') || 'all';
    const newRecipient = searchParams.get('recipient') || 'all';
    const newPriceMin = parseInt(searchParams.get('priceMin') || '0', 10);
    const newPriceMaxQuery = searchParams.get('priceMax');
    const newPriceMax = newPriceMaxQuery !== null ? parseInt(newPriceMaxQuery, 10) : serverMaxPrice;

    setActiveFilters({
        category: newCategory,
        priceRange: [newPriceMin, Math.min(newPriceMax, serverMaxPrice)],
        occasion: newOccasion,
        recipient: newRecipient,
    });
    setCurrentPage(1); // Reset to first page on filter change from URL
  }, [searchParams, serverMaxPrice]);


  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...PRODUCTS];

    // Apply category filter (Gift Type)
    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
    }

    // Apply occasion filter
    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion?.includes(activeFilters.occasion));
    }
    
    // Apply recipient filter
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient?.includes(activeFilters.recipient));
    }

    // Apply price range filter
    tempProducts = tempProducts.filter(p => p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]);

    // Apply sorting
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
    if (initialSort === 'trending') { 
       tempProducts = tempProducts.filter(p => p.trending).sort((a,b) => b.popularity - a.popularity);
    }

    return tempProducts;
  }, [activeFilters, sortOption, initialSort]);

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
      
      <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="lg:col-span-1">
          <ProductFilters 
            initialFilters={{ // Pass only what ProductFilters UI can control
                category: activeFilters.category, 
                priceRange: activeFilters.priceRange,
                // occasion and recipient are not managed by ProductFilters UI directly
            }} 
            onFilterChange={(newFilters) => {
                setActiveFilters(prev => ({
                    ...prev, // Keep existing occasion and recipient
                    category: newFilters.category,
                    priceRange: newFilters.priceRange,
                }));
                setCurrentPage(1);
            }}
            maxPrice={serverMaxPrice}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border rounded-lg shadow-sm bg-card gap-2 sm:gap-4">
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

