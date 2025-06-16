"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/site';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';

export function NavMenu({isMobile = false, onLinkClick}: {isMobile?: boolean, onLinkClick?: () => void}) {
  const pathname = usePathname();
  const { wishlist } = useWishlist();

  return (
    <nav className={cn("flex gap-2", isMobile ? "flex-col space-y-2" : "items-center space-x-1 md:space-x-2")}>
      {NAV_LINKS.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:text-primary",
              isMobile ? "text-base" : ""
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.icon && <link.icon className={cn("h-4 w-4 mr-2", isActive ? "text-primary-foreground" : "text-foreground group-hover:text-primary transition-colors")} />}
            {link.label}
            {link.href === '/wishlist' && wishlist.length > 0 && (
              <Badge variant="destructive" className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {wishlist.length}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
