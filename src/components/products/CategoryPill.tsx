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
          "w-full h-auto p-4 flex flex-col items-center justify-center space-y-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
          "border-border bg-card hover:bg-accent/10 hover:border-accent"
        )}
        aria-label={`View products in ${category.name}`}
      >
        {IconComponent && (
          <IconComponent className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-200" strokeWidth={1.5} />
        )}
        {/* If no icon, could use a placeholder image based on dataAiHint */}
        {!IconComponent && category.dataAiHint && (
           <Image
            src={`https://placehold.co/80x80.png`} // Placeholder, actual image would be better
            alt={category.name}
            width={60}
            height={60}
            className="rounded-md object-cover"
            data-ai-hint={category.dataAiHint}
          />
        )}
        <span className="font-headline text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200 text-center">
          {category.name}
        </span>
      </Button>
    </Link>
  );
}
