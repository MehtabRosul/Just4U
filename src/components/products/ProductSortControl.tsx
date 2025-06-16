
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

interface ProductSortControlProps {
  currentSort: SortOption;
  onSortChange: (sortOption: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

export function ProductSortControl({ currentSort, onSortChange }: ProductSortControlProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
      <Label htmlFor="sort-select" className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:block">
        <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 text-muted-foreground" />
        Sort by:
      </Label>
      <Select value={currentSort} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger id="sort-select" className="w-full sm:w-[180px] md:w-[200px] text-xs sm:text-sm">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
