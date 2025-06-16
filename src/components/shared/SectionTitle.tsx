
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionTitle({ children, className, as = 'h2', ...props }: SectionTitleProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'font-headline text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6 md:mb-8 text-center',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
