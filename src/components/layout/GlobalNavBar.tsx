
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { GLOBAL_NAV_LINKS } from '@/config/site';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"; // Assuming you have this or similar for mega menus
import React from 'react';

export default function GlobalNavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 w-full bg-[var(--global-nav-bg)] text-foreground shadow-md h-12 flex items-center">
      <div className="container mx-auto px-4">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex justify-center sm:justify-start space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
            {GLOBAL_NAV_LINKS.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary data-[active]:bg-accent/10 data-[state=open]:bg-accent/10 text-xs sm:text-sm px-2 py-1.5 sm:px-3">
                      {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-popover text-popover-foreground">
                      {/* Basic Dropdown, Mega Menu would be more complex */}
                      <ul className="grid w-[200px] gap-2 p-3 md:w-[250px] lg:w-[300px]">
                        {item.children.map((child) => (
                          <ListItem key={child.label} href={child.href} title={child.label} className="hover:bg-accent/20 focus:bg-accent/20">
                            {/* Optional: Add description or icon for child items */}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary text-xs sm:text-sm px-2 py-1.5 sm:px-3",
                        pathname === item.href ? "text-primary border-b-2 border-primary rounded-none" : ""
                      )}
                    >
                      {item.icon && <item.icon className="mr-1.5 h-4 w-4" />}
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-xs sm:text-sm font-medium leading-none">{title}</div>
          {children && <p className="line-clamp-2 text-xs sm:text-sm leading-snug text-muted-foreground">
            {children}
          </p>}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
