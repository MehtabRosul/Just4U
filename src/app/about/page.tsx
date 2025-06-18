
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Users, Target, Gift, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-10 text-center">About Just4UGifts</SectionTitle>

      <div className="space-y-12">
        <section className="text-center">
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to Just4UGifts, your premier destination for finding unique, personalized, and heartfelt gifts for every occasion and every special person in your life. We believe that a gift is more than just an item; it's a message from the heart, a way to share joy, and a token of appreciation.
          </p>
        </section>

        <section>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 font-headline">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded with a passion for celebrating life's moments, Just4UGifts started as a small idea to make gift-giving a delightful and stress-free experience. We noticed that finding that truly special, personalized gift often involved a lot of searching and uncertainty. Our mission became clear: to curate a wide range of high-quality, customizable gifts that speak volumes and create lasting memories.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From handcrafted miniatures and stunning 3D crystals to beautifully engraved wooden plaques and fun, personalized mugs, our collection is carefully selected to ensure there's something perfect for everyone.
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Crafting a personalized gift"
                fill
                className="object-cover"
                data-ai-hint="gift crafting workshop"
              />
            </div>
          </div>
        </section>

        <section className="bg-secondary p-6 sm:p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6 text-center font-headline">What We Stand For</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:shadow-primary/30 transition-shadow">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Quality & Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                We partner with skilled artisans and trusted suppliers to bring you gifts that are not only beautiful but also built to last.
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-primary/30 transition-shadow">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                   <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Personalization</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                We specialize in making gifts truly unique. Many of our items can be personalized with names, photos, messages, and more.
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-primary/30 transition-shadow">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Customer Happiness</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                Your satisfaction is our top priority. Our friendly support team is always here to help you find the perfect gift and ensure a smooth experience.
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-4 font-headline">Join Our Gifting Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Follow us on social media and subscribe to our newsletter for the latest gift ideas, special offers, and heartwarming stories from our community of happy gifters and grateful recipients.
            </p>
        </section>

      </div>
    </div>
  );
}
