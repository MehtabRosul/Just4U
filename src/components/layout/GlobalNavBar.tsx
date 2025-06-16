
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'; // Assuming these are correctly set up shadcn components
import { cn } from '@/lib/utils';
import { GLOBAL_NAV_LINKS } from '@/config/site'; // Sourced from site config
import type { NavItem } from '@/lib/types'; // Using the shared NavItem type
import React from 'react'; // Added React for ListItem forwardRef

export default function GlobalNavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[calc(var(--primary-header-height)_+_var(--top-utility-height))] z-40 w-full border-b border-border bg-[var(--global-nav-bg)] shadow-sm">
      <div className="container mx-auto flex h-12 items-center justify-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            {GLOBAL_NAV_LINKS.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="text-sm font-medium text-foreground/90 hover:text-primary data-[state=open]:text-primary">
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {/* Mega Menu Structure - Placeholder, to be implemented based on new design */}
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background text-foreground border-border">
                        {item.children.map((child) => (
                          <ListItem
                            key={child.label}
                            href={child.href}
                            title={child.label}
                            className={pathname === child.href ? "bg-muted text-primary" : "hover:bg-muted"}
                          >
                            {/* Optional: Add a short description for child items */}
                          </ListItem>
                        ))}
                      </ul>
                      {/* Further mega menu columns/content based on design */}
                    </NavigationMenuContent>
                  </>
                ) : (
                  // Direct link if no children (e.g., Corporate Gifts, Offers)
                  <Link href={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-sm font-medium',
                        pathname === item.href ? 'text-primary bg-primary/10' : 'text-foreground/90 hover:text-primary hover:bg-accent/10'
                      )}
                      active={pathname === item.href}
                    >
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

// ListItem component for dropdowns/mega-menus
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!} // Asserting href is defined for ListItem links
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
