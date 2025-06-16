
"use client";

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/data';
import type { Category } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { XIcon, FilterIcon } from 'lucide-react';

export interface Filters {
  category: string;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  initialFilters?: Partial<Filters>;
  onFilterChange: (filters: Filters) => void;
  maxPrice?: number;
}

const DEFAULT_MAX_PRICE = 500;

export function ProductFilters({ 
  initialFilters = {}, 
  onFilterChange,
  maxPrice = DEFAULT_MAX_PRICE
}: ProductFiltersProps) {
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange || [0, maxPrice]);

  useEffect(() => {
    // Update internal price range if maxPrice changes and current max exceeds new maxPrice
    if (priceRange[1] > maxPrice) {
      setPriceRange([priceRange[0], maxPrice]);
    } else if (priceRange[1] === DEFAULT_MAX_PRICE && maxPrice !== DEFAULT_MAX_PRICE){
       setPriceRange([priceRange[0], maxPrice]); // initialize if default max price was used
    }
  }, [maxPrice, priceRange]);


  const handleApplyFilters = () => {
    onFilterChange({ category, priceRange });
  };

  const handleResetFilters = () => {
    setCategory('all');
    setPriceRange([0, maxPrice]);
    onFilterChange({ category: 'all', priceRange: [0, maxPrice] });
  };

  return (
    <aside className="space-y-4 sm:space-y-6 p-3 sm:p-4 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-lg sm:text-xl font-semibold text-foreground">Filters</h3>
         <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs sm:text-sm px-2 py-1 text-muted-foreground hover:text-primary">
          <XIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Reset
        </Button>
      </div>
      
      <div>
        <Label htmlFor="category-filter" className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block text-foreground">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category-filter" className="w-full text-xs sm:text-sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat: Category) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block text-foreground">Price Range</Label>
        <Slider
          min={0}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(newRange) => setPriceRange(newRange as [number, number])}
          className="my-3 sm:my-4"
        />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
          <span>Rs. {priceRange[0]}</span>
          <span>Rs. {priceRange[1]}</span>
        </div>
      </div>
      
      <Button onClick={handleApplyFilters} className="w-full text-sm sm:text-base py-2 sm:py-2.5">
        <FilterIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2"/> Apply Filters
      </Button>
    </aside>
  );
}
