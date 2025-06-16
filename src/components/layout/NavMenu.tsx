
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/types'; // Using the shared NavItem type
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface NavMenuProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
  navLinks: NavItem[]; // Expects a list of NavItems
}

export function NavMenu({ isMobile = false, onLinkClick, navLinks }: NavMenuProps) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <Accordion type="multiple" className="w-full">
        {navLinks.map((link) => (
          link.children && link.children.length > 0 ? (
            <AccordionItem value={link.label} key={link.label}>
              <AccordionTrigger className="text-base py-3 px-1 hover:no-underline hover:text-primary text-foreground/80 data-[state=open]:text-primary">
                <div className="flex items-center">
                  {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                  {link.label}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <ul className="space-y-1">
                  {link.children.map(child => (
                     <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={onLinkClick}
                          className={cn(
                            "block text-sm py-2 px-3 hover:bg-muted rounded-md w-full text-left transition-colors",
                            pathname === child.href ? "text-primary bg-muted" : "text-foreground/70"
                          )}
                          aria-current={pathname === child.href ? 'page' : undefined}
                        >
                          {child.label}
                        </Link>
                     </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center text-base py-3 px-1 hover:bg-muted rounded-md w-full text-left transition-colors",
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-foreground/80",
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.icon && <link.icon className="mr-2 h-5 w-5" />}
              {link.label}
            </Link>
          )
        ))}
      </Accordion>
    );
  }

  // Desktop navigation (currently handled by GlobalNavBar, this is a fallback or for other contexts)
  return (
    <nav className={cn(
        "flex items-center",
        isMobile ? "flex-col space-y-2 w-full" : "space-x-3 lg:space-x-4"
      )}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        // Simplified for desktop as GlobalNavBar is primary
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
