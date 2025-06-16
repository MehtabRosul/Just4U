
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/site';
import { cn } from '@/lib/utils';

export function NavMenu({isMobile = false, onLinkClick}: {isMobile?: boolean, onLinkClick?: () => void}) {
  const pathname = usePathname();

  return (
    <nav className={cn(
        "flex items-center",
        isMobile ? "flex-col space-y-2 w-full" : "space-x-3 lg:space-x-4"
      )}
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary"
                : "text-foreground/70",
              isMobile ? "text-base py-2 px-3 hover:bg-muted rounded-md w-full text-left" : "py-2"
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
