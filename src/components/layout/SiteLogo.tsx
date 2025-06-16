"use client";
import Link from 'next/link';
import { Gift } from 'lucide-react'; // Or a custom logo SVG

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Gift className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl font-semibold text-primary">
        Just4UGifts
      </span>
      <span className="font-headline text-2xl font-light text-foreground/80">
        Curator
      </span>
    </Link>
  );
}
