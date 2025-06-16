
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
  category: string; // Gift Type
  priceRange: [number, number];
  occasion?: string; // Optional, ProductFilters UI doesn't directly control these
  recipient?: string; // Optional
}

interface ProductFiltersProps {
  initialFilters?: Partial<Filters>;
  onFilterChange: (filters: Pick<Filters, 'category' | 'priceRange'>) => void; // Only sends back what it controls
  maxPrice?: number;
}

const DEFAULT_MAX_PRICE = 1000; // Increased default

export function ProductFilters({ 
  initialFilters = {}, 
  onFilterChange,
  maxPrice = DEFAULT_MAX_PRICE
}: ProductFiltersProps) {
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange || [0, maxPrice]);

  useEffect(() => {
    setCategory(initialFilters.category || 'all');
    setPriceRange(initialFilters.priceRange || [0, maxPrice]);
  }, [initialFilters, maxPrice]);


  const handleApplyFilters = () => {
    onFilterChange({ category, priceRange });
  };

  const handleResetFilters = () => {
    const defaultCategory = 'all';
    const defaultPriceRange: [number, number] = [0, maxPrice];
    setCategory(defaultCategory);
    setPriceRange(defaultPriceRange);
    onFilterChange({ category: defaultCategory, priceRange: defaultPriceRange });
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
        <Label htmlFor="category-filter" className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block text-foreground">Gift Type</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category-filter" className="w-full text-xs sm:text-sm">
            <SelectValue placeholder="Select gift type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gift Types</SelectItem>
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
          step={10} // Adjusted step for finer control if needed
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

