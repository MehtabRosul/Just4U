
"use client";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SiteLogoProps {
  className?: string;
  hideTagline?: boolean;
}

export function SiteLogo({ className, hideTagline = false }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("flex flex-col items-start group", className)}>
      <div className="flex items-baseline relative">
        <span className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
          just
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-primary">
          4U
        </span>
      </div>
      {!hideTagline && (
        <div className="relative w-[130px] sm:w-[155px] -mt-1 sm:-mt-1.5">
           <span className="block text-[10px] sm:text-xs text-muted-foreground tracking-wide font-medium relative z-10 bg-transparent px-1 group-hover:text-foreground/80 transition-colors">
            gift with personal touch
          </span>
          {/* Underline effect can be tricky with bg-transparent. Consider if it's needed or adjust styling. */}
          {/* <div className="absolute bottom-[5px] sm:bottom-[6px] left-0 w-full h-[2px] bg-primary/80 z-0"></div> */}
        </div>
      )}
    </Link>
  );
}
