
"use client";
import Link from 'next/link';
import { Gift } from 'lucide-react'; 

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
      <Gift className="h-6 w-6 sm:h-7 sm:w-8 text-accent" />
      <span className="font-headline text-lg sm:text-xl md:text-2xl font-semibold text-primary">
        Just4UGifts
      </span>
      <span className="font-headline text-lg sm:text-xl md:text-2xl font-light text-foreground/80 hidden xs:inline">
        Curator
      </span>
    </Link>
  );
}
