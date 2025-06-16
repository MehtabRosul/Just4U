"use client";

import { Share2, Mail, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast'; // Corrected import path

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const { toast } = useToast();

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast({ title: 'Link Copied!', description: 'Product link copied to clipboard.' });
        } catch (err) {
          toast({ title: 'Failed to copy', description: 'Could not copy link to clipboard.', variant: 'destructive' });
        }
      },
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`),
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle, // Using MessageCircle as a generic chat icon, as Lucide might not have WhatsApp specifically.
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank'),
    },
    // Add more social platforms like Twitter, Facebook if needed
    // {
    //   name: 'Twitter',
    //   icon: TwitterIcon, // Assuming a TwitterIcon component or SVG
    //   action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank'),
    // },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Share product">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex space-x-1">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="ghost"
              size="icon"
              onClick={option.action}
              aria-label={`Share via ${option.name}`}
              title={`Share via ${option.name}`}
            >
              <option.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
