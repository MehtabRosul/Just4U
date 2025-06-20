
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
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

const calculateInitialMaxPrice = (products: Product[]): number => {
  if (!products || products.length === 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  const prices = products.map(p => p.price).filter(price => typeof price === 'number' && !isNaN(price));
  if (prices.length === 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  const maxActualPrice = Math.max(...prices);
  return maxActualPrice > 0 ? maxActualPrice : Number.MAX_SAFE_INTEGER;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    setHasMounted(true);
    const calculatedMax = calculateInitialMaxPrice(PRODUCTS);
    setInitialMaxPrice(calculatedMax);
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
    if (!hasMounted || (initialMaxPrice === Number.MAX_SAFE_INTEGER && PRODUCTS.length > 0)) {
        return;
    }

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
            newMaxPrice = initialMaxPrice; 
        } else if (isNaN(parsedMax)) {
            // Keep newMaxPrice as initialMaxPrice
        }
    }
    
    if (newMinPrice > newMaxPrice || (newMaxPrice === 0 && initialMaxPrice > 0) || isNaN(newMinPrice) || isNaN(newMaxPrice)) {
        newMinPrice = 0; 
        newMaxPrice = initialMaxPrice;
    }
    
    const newFilters: ActiveFilters = {
        category: categoryFromUrl,
        priceRange: [newMinPrice, newMaxPrice],
        occasion: occasionFromUrl,
        recipient: recipientFromUrl,
    };

    const filtersChanged = JSON.stringify(activeFilters) !== JSON.stringify(newFilters);
    const sortChanged = sortOption !== sortFromUrl;

    if (filtersChanged) {
      setActiveFilters(newFilters);
      setCurrentPage(1); 
    }
    
    if (sortChanged) {
      setSortOption(sortFromUrl);
      if (!filtersChanged) setCurrentPage(1); 
    }

  }, [searchParams, hasMounted, initialMaxPrice, activeFilters, sortOption]);


  const filteredAndSortedProducts = useMemo(() => {
    if (!PRODUCTS || PRODUCTS.length === 0) {
      return [];
    }

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

    const [minPrice, maxPrice] = activeFilters.priceRange;
    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && !isNaN(minPrice) && !isNaN(maxPrice) && minPrice <= maxPrice) {
        if (minPrice > 0 || maxPrice < initialMaxPrice) { 
            tempProducts = tempProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
        }
    }
    
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
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }
    return tempProducts;

  }, [activeFilters, sortOption, initialMaxPrice]); 
  
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
    
    if (titleParts.length === 0 && searchParams.toString() === '') {
        return "All Gifts";
    } else if (titleParts.length === 0 && searchParams.toString() !== '') {
        return "Filtered Gifts";
    }

    const baseTitle = titleParts.join(" ");
    return baseTitle.toLowerCase().endsWith("gifts") ? baseTitle : baseTitle + " Gifts";
  };

  if (PRODUCTS && PRODUCTS.length > 0 && currentProducts.length === 0 && filteredAndSortedProducts.length === 0 && hasMounted) {
    // This condition might indicate that filters are too restrictive for the *available data*
    // Or if PRODUCTS is somehow empty after initial load, which top-level logs would show.
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
    

    

    
