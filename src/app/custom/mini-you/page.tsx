
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function CreateMiniYouPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <SectionTitle className="mb-8">Create Your Mini You</SectionTitle>
      <div className="max-w-2xl mx-auto p-8 border border-dashed rounded-lg bg-card">
        <Lightbulb className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Coming Soon!
        </h2>
        <p className="text-muted-foreground mb-8">
          We're hard at work building this exciting feature where you'll be able to create personalized "Mini You" figures. Stay tuned for updates!
        </p>
        <Button asChild size="lg">
          <Link href="/">
            Back to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
