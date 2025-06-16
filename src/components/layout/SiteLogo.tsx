
"use client";
import Link from 'next/link';

export function SiteLogo() {
  return (
    <Link href="/" className="flex flex-col items-start group">
      <div className="flex items-baseline relative">
        <span className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
          just
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-primary">
          4
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-primary">
          U
        </span>
      </div>
      <div className="relative w-[130px] sm:w-[155px] -mt-1 sm:-mt-1.5">
        <span className="block text-[10px] sm:text-xs text-muted-foreground tracking-wide font-medium relative z-10 bg-background px-1">
          gift with personal touch
        </span>
        <div className="absolute bottom-[5px] sm:bottom-[6px] left-0 w-full h-[2px] bg-primary/80 z-0"></div>
      </div>
    </Link>
  );
}
