
"use client";

import Link from 'next/link';
import { TOP_UTILITY_LINKS } from '@/config/site';
import type { UtilityLink } from '@/lib/types';

export default function TopUtilityBar() {
  return (
    <div className="bg-[var(--top-utility-bg)] text-[var(--top-utility-fg)] h-[24px] text-xs sm:text-sm flex items-center justify-center sm:justify-between px-4">
      <div className="hidden sm:block">
        <span>Free Shipping Across India</span>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        {TOP_UTILITY_LINKS.map((link: UtilityLink) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : '_self'}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
