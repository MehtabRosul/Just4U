
import Link from 'next/link';
import { SITE_TITLE, FOOTER_LINKS } from '@/config/site';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
            </p>
            <p className="text-xs mt-1">
              Curating the best gifts from Just4UGifts.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex space-x-4">
              {FOOTER_LINKS.social.map((link) => (
                <Link key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-primary transition-colors"
                   aria-label={link.name}>
                  <link.icon />
                </Link>
              ))}
            </div>
            <div className="flex space-x-3 text-xs">
              {FOOTER_LINKS.legal.map(link => (
                <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
             <div className="flex space-x-3 text-xs">
              {FOOTER_LINKS.company.map(link => (
                <Link key={link.name} href={link.href} className="hover:text-primary transition-colors" target={link.href.startsWith('http') ? '_blank' : '_self'}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
