"use client";
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SiteLogoProps {
  className?: string;
  hideTagline?: boolean;
}

export function SiteLogo({ className, hideTagline = false }: SiteLogoProps) {
  return (
    <Link 
      href="/" 
      className={cn(
        "inline-block group",
        className
      )}
      aria-label="Just4U Home"
    >
      <Image
        src={require('@/Logo/Just4U_Logo.png')}
        alt="Just4U Logo"
        width={230}
        height={100}
        priority
        className="w-[130px] sm:w-[218px] h-auto transition-transform duration-200 ease-in-out group-hover:scale-105 object-contain"
      />
      {!hideTagline && (
        <div className="w-full flex justify-center mt-1">
        </div>
      )}
    </Link>
  );
}
