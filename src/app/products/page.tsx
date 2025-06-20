
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, OCCASIONS_LIST, RECIPIENTS_LIST } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductSortControl, type SortOption } from '@/components/products/ProductSortControl';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12; // Adjusted items per page

interface ActiveFilters {
  category: string;
  priceRange: [number, number];
  occasion: string;
  recipient: string;
}

const calculateMaxProductPrice = (products: Product[]): number => {
  if (!products || products.length === 0) return Number.MAX_SAFE_INTEGER;
  const prices = products.map(p => p.price).filter(price => typeof price === 'number' && !isNaN(price));
  if (prices.length === 0) return Number.MAX_SAFE_INTEGER;
  const max = Math.max(...prices);
  return max > 0 ? max : Number.MAX_SAFE_INTEGER;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  
  const [initialMaxPrice, setInitialMaxPrice] = useState<number>(calculateMaxProductPrice(PRODUCTS));

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: 'all',
    priceRange: [0, initialMaxPrice],
    occasion: 'all',
    recipient: 'all',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setHasMounted(true);
    // Recalculate initialMaxPrice on client side if it wasn't set correctly initially
    const clientCalculatedMaxPrice = calculateMaxProductPrice(PRODUCTS);
    if (clientCalculatedMaxPrice !== initialMaxPrice) {
        setInitialMaxPrice(clientCalculatedMaxPrice);
        // If activeFilters' max price was based on the old initialMaxPrice, update it
        setActiveFilters(prevFilters => ({
            ...prevFilters,
            priceRange: [prevFilters.priceRange[0], clientCalculatedMaxPrice]
        }));
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const categoryFromUrl = searchParams.get('category') || 'all';
    const occasionFromUrl = searchParams.get('occasion') || 'all';
    const recipientFromUrl = searchParams.get('recipient') || 'all';
    const sortFromUrl = (searchParams.get('sort') as SortOption) || 'popularity';

    const priceMinQuery = searchParams.get('priceMin');
    const priceMaxQuery = searchParams.get('priceMax');
    
    let newMinPrice = 0;
    if (priceMinQuery !== null) {
        const parsedMin = parseInt(priceMinQuery, 10);
        if (!isNaN(parsedMin) && parsedMin >= 0) newMinPrice = parsedMin;
    }

    let newMaxPrice = initialMaxPrice; 
    if (priceMaxQuery !== null) {
        const parsedMax = parseInt(priceMaxQuery, 10);
        if (!isNaN(parsedMax) && parsedMax >= newMinPrice) newMaxPrice = parsedMax;
        else if (!isNaN(parsedMax) && parsedMax < newMinPrice) newMaxPrice = initialMaxPrice;
    }
    
    if (newMinPrice > newMaxPrice || isNaN(newMinPrice) || isNaN(newMaxPrice)) {
        newMinPrice = 0; 
        newMaxPrice = initialMaxPrice;
    }
    
    const newUrlFiltersState: ActiveFilters = {
        category: categoryFromUrl,
        priceRange: [newMinPrice, newMaxPrice],
        occasion: occasionFromUrl,
        recipient: recipientFromUrl,
    };

    let filtersActuallyChanged = false;
    if (JSON.stringify(activeFilters) !== JSON.stringify(newUrlFiltersState)) {
        setActiveFilters(newUrlFiltersState);
        setCurrentPage(1); 
        filtersActuallyChanged = true;
    }
    
    if (sortOption !== sortFromUrl) {
      setSortOption(sortFromUrl);
      if (!filtersActuallyChanged) setCurrentPage(1);
    }

  }, [searchParams, hasMounted, initialMaxPrice]);


  const filteredAndSortedProducts = useMemo(() => {
    if (!PRODUCTS || PRODUCTS.length === 0) return [];
    
    let tempProducts = [...PRODUCTS];

    // Apply category filter
    if (activeFilters.category !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === activeFilters.category);
    }
    // Apply occasion filter
    if (activeFilters.occasion !== 'all') {
      tempProducts = tempProducts.filter(p => p.occasion && p.occasion.includes(activeFilters.occasion));
    }
    // Apply recipient filter
    if (activeFilters.recipient !== 'all') {
      tempProducts = tempProducts.filter(p => p.recipient && p.recipient.includes(activeFilters.recipient));
    }
    // Apply price range filter
    const [minPrice, maxPrice] = activeFilters.priceRange;
    if (typeof minPrice === 'number' && typeof maxPrice === 'number' && (minPrice > 0 || maxPrice < initialMaxPrice)) {
         tempProducts = tempProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
    
    console.log(`[DIAGNOSTIC_FILTER_MEMO] Products after all filters: ${tempProducts.length}. Filters:`, activeFilters);

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
          if (trendingB !== trendingA) return trendingB - trendingA; 
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
    
    if (titleParts.length === 0 || (activeFilters.category === 'all' && activeFilters.occasion === 'all' && activeFilters.recipient === 'all')) {
        return "All Gifts";
    }
    const baseTitle = titleParts.join(" ");
    return baseTitle.toLowerCase().endsWith("gifts") ? baseTitle : baseTitle + " Gifts";
  };

  if (filteredAndSortedProducts.length === 0 && PRODUCTS.length > 0 && hasMounted) {
      console.error(
        `[DIAGNOSTIC_RENDER_ISSUE] PRODUCTS array is populated, but no products are displayed. Active Filters:`, activeFilters, `Initial Max Price: ${initialMaxPrice}`, `Current Sort: ${sortOption}`
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
