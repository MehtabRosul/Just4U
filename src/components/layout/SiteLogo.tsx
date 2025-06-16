
"use client";
import Link from 'next/link';
import { Gift } from 'lucide-react'; 

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
      <span className="font-headline text-xl sm:text-2xl font-semibold text-primary">
        Just4UGifts
      </span>
      <span className="font-headline text-xl sm:text-2xl font-light text-foreground/80">
        Curator
      </span>
    </Link>
  );
}
