
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
          "w-full h-auto p-2.5 sm:p-3 md:p-4 flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
          "border-border bg-card hover:bg-accent/10 hover:border-accent"
        )}
        aria-label={`View products in ${category.name}`}
      >
        {IconComponent && (
          <IconComponent className="h-7 w-7 sm:h-8 md:h-10 text-primary group-hover:text-accent transition-colors duration-200" strokeWidth={1.5} />
        )}
        {!IconComponent && category.dataAiHint && (
           <Image
            src={`https://placehold.co/80x80.png`} 
            alt={category.name}
            width={40} 
            height={40}
            className="rounded-md object-cover sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]"
            data-ai-hint={category.dataAiHint}
          />
        )}
        <span className="font-headline text-[11px] sm:text-xs md:text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200 text-center leading-tight">
          {category.name}
        </span>
      </Button>
    </Link>
  );
}
