
"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  starSize?: string; // e.g., "h-4 w-4"
  className?: string;
  iconClassName?: string;
}

export function StarRating({ rating, totalStars = 5, starSize = "h-4 w-4", className, iconClassName }: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // Rounds to nearest 0.5, e.g., 3.7 -> 3.5, 3.8 -> 4.0

  return (
    <div className={cn("flex items-center space-x-0.5", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        let fillClass = 'text-gray-300 dark:text-gray-600'; // Default empty

        if (roundedRating >= starValue) {
          fillClass = 'text-yellow-400 fill-yellow-400'; // Full star
        } else if (roundedRating + 0.5 === starValue) {
          // This logic is for a true half-star icon, which lucide-react's Star doesn't directly support by prop.
          // For simplicity with Lucide, we'll just show filled up to the rounded rating.
          // If a half-star visual is strictly needed, a custom SVG or a different icon library would be better.
          // For now, it will be similar to a full star if roundedRating ends in .5 and it's the next star.
           fillClass = 'text-yellow-400 fill-yellow-400'; // Treat as full for simplicity here
        }

        return (
          <Star
            key={index}
            className={cn(starSize, fillClass, iconClassName)}
          />
        );
      })}
    </div>
  );
}
