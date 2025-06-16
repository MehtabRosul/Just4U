"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductFilters, type Filters } from '@/components/products/ProductFilters';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = (searchParams.get('sort') as SortOption) || 'popularity';

  const [filters, setFilters] = useState<Filters>({ category: initialCategory, priceRange: [0, 500] });
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Determine max price from all products for the slider
  const maxPrice = useMemo(() => {
    if (PRODUCTS.length === 0) return 500; // Default max price
    return Math.max(...PRODUCTS.map(p => p.price), 0);
  }, []);

  // Update price range in filters if maxPrice changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      priceRange: [prevFilters.priceRange[0], maxPrice]
    }));
  }, [maxPrice]);


  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...PRODUCTS];

    // Apply category filter
    if (filters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === filters.category);
    }

    // Apply price filter
    tempProducts = tempProducts.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

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
    if (initialSort === 'trending') { // Special case from homepage link
       tempProducts = tempProducts.filter(p => p.trending).sort((a,b) => b.popularity - a.popularity);
    }


    return tempProducts;
  }, [filters, sortOption, initialSort]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  const currentCategoryName = filters.category === 'all' 
    ? 'All Gifts' 
    : CATEGORIES.find(c => c.slug === filters.category)?.name || 'Gifts';

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle>{currentCategoryName}</SectionTitle>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters 
            initialFilters={{category: initialCategory, priceRange: [0, maxPrice]}} 
            onFilterChange={(newFilters) => {setFilters(newFilters); setCurrentPage(1);}}
            maxPrice={maxPrice}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg shadow-sm bg-card">
            <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Showing {currentProducts.length} of {filteredAndSortedProducts.length} products
            </p>
            <ProductSortControl currentSort={sortOption} onSortChange={(newSort) => {setSortOption(newSort); setCurrentPage(1);}} />
          </div>

          <ProductList products={currentProducts} onViewDetails={handleViewDetails} />

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
                  // Basic pagination logic: show first, last, current, and +/- 1 from current
                  const showPage = pageNum === 1 || pageNum === totalPages || pageNum === currentPage || pageNum === currentPage - 1 || pageNum === currentPage + 1;
                  const showEllipsis = (pageNum === currentPage - 2 && currentPage > 3) || (pageNum === currentPage + 2 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return <PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>;
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
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
