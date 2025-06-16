
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CategoryPillProps {
  category: Category;
}

export function CategoryPill({ category }: CategoryPillProps) {
  const IconComponent = category.Icon;
  return (
    <Link href={`/products?category=${category.slug}`} className="block group">
      <Button
        variant="outline"
        className={cn(
          "w-full h-auto p-3 sm:p-4 flex flex-col items-center justify-center space-y-1 sm:space-y-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
          "border-border bg-card hover:bg-accent/10 hover:border-accent"
        )}
        aria-label={`View products in ${category.name}`}
      >
        {IconComponent && (
          <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-primary group-hover:text-accent transition-colors duration-200" strokeWidth={1.5} />
        )}
        {!IconComponent && category.dataAiHint && (
           <Image
            src={`https://placehold.co/80x80.png`} 
            alt={category.name}
            width={50} // Adjusted for smaller screens
            height={50} // Adjusted for smaller screens
            className="rounded-md object-cover sm:w-[60px] sm:h-[60px]"
            data-ai-hint={category.dataAiHint}
          />
        )}
        <span className="font-headline text-xs sm:text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200 text-center">
          {category.name}
        </span>
      </Button>
    </Link>
  );
}
