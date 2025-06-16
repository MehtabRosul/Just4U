
"use client";

import { useState, useEffect } from 'react';
import type { Product, Occasion, GiftType, Recipient } from '@/lib/types';
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card'; // For Top Curations, etc.

// Placeholder components for complex homepage sections
const HeroCarousel = () => (
  <section className="relative bg-neutral-800 h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-center mb-8 sm:mb-12">
    <Image src="https://placehold.co/1200x500.png?text=Hero+Carousel+Slide+1&font=poppins" alt="Hero Carousel" layout="fill" objectFit="cover" className="opacity-30" data-ai-hint="gifts sale promotion"/>
    <div className="relative z-10 p-4">
      <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-4">
        Hero Carousel Headline
      </h1>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 rounded-md px-6 py-3 sm:px-8 sm:py-3.5">
        <Link href="/products">Grab Yours</Link>
      </Button>
    </div>
  </section>
);

const ManualBannerSlot = () => (
  <section className="my-8 sm:my-12">
    <div className="container mx-auto">
       <div className="bg-background border border-border rounded-lg p-6 sm:p-8 text-center h-[100px] flex flex-col justify-center items-center" style={{maxWidth: '300px', margin: '0 auto'}}>
        <h2 className="font-headline text-lg sm:text-xl font-semibold text-foreground mb-2">Manual Banner Slot</h2>
        <Button asChild variant="link" className="text-primary hover:text-primary/80">
          <Link href="/products">Shop Now <ArrowRight className="ml-1 h-4 w-4"/></Link>
        </Button>
      </div>
    </div>
  </section>
);

const SmartFinderPanel = () => {
  const [priceRange, setPriceRange] = useState([50, 300]);
  return (
    <section className="bg-neutral-900 py-6 sm:py-8 my-8 sm:my-12 rounded-lg">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-background mb-4 sm:mb-6 text-xl sm:text-2xl">Find The Perfect Gift</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
          <Select>
            <SelectTrigger className="w-full bg-input text-foreground border-border placeholder:text-input-placeholder focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Occasion" />
            </SelectTrigger>
            <SelectContent>
              {OCCASIONS_LIST.slice(0,5).map(o => <SelectItem key={o.id} value={o.slug}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full bg-input text-foreground border-border placeholder:text-input-placeholder focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Gift Type" />
            </SelectTrigger>
            <SelectContent>
              {GIFT_TYPES_LIST.slice(0,5).map(gt => <SelectItem key={gt.id} value={gt.slug}>{gt.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full bg-input text-foreground border-border placeholder:text-input-placeholder focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              {RECIPIENTS_LIST.slice(0,5).map(r => <SelectItem key={r.id} value={r.slug}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="sm:col-span-2 md:col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}</label>
            <Slider
              defaultValue={[50, 300]}
              min={0} max={1000} step={10}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="[&>span]:bg-primary"
            />
          </div>
        </div>
         <div className="mt-4 text-center">
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground text-sm px-6">Find Gifts</Button>
        </div>
      </div>
    </section>
  )
};

const TopCurations = () => {
  const curations = [
    { name: 'Birthday', Icon: OCCASIONS_LIST.find(o=>o.slug==='birthday')?.Icon, slug:'birthday', type: 'occasion' },
    { name: 'Anniversary', Icon: OCCASIONS_LIST.find(o=>o.slug==='anniversary')?.Icon, slug:'anniversary', type: 'occasion' },
    { name: 'Corporate', Icon: GIFT_TYPES_LIST.find(gt=>gt.slug==='premium-gifts')?.Icon, slug:'premium-gifts', type: 'giftType' },
    { name: 'Personalized', Icon: GIFT_TYPES_LIST.find(gt=>gt.slug==='photo-gifts')?.Icon, slug:'photo-gifts', type: 'giftType' },
    { name: 'Miniature', Icon: GIFT_TYPES_LIST.find(gt=>gt.slug==='miniature')?.Icon, slug:'miniature', type: 'giftType' },
  ];
  return (
    <section className="my-8 sm:my-12">
      <SectionTitle>Top Curations</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {curations.map(item => {
          const ItemIcon = item.Icon;
          const link = item.type === 'occasion' ? `/products?occasion=${item.slug}` : `/products?category=${item.slug}`;
          return (
            <Link key={item.name} href={link} passHref>
              <Card className="bg-neutral-800 text-center p-3 sm:p-4 rounded-lg hover:shadow-lg transition-shadow group">
                <CardContent className="flex flex-col items-center justify-center space-y-2">
                  {ItemIcon && <div className="bg-primary p-2 sm:p-3 rounded-full mb-1 sm:mb-2"><ItemIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" /></div>}
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-primary text-xs font-medium group-hover:underline">Explore Gifts</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
};

const DailySpotlight = ({ products }: { products: Product[] }) => (
  <section className="my-8 sm:my-12">
    <SectionTitle>Just for Today</SectionTitle>
    {products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0,4).map(p => (
           <Card key={p.id} className="bg-card text-card-foreground overflow-hidden relative group">
             <Link href={`/products/${p.slug}`} className="block">
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded z-10">Deal of the Day</div>
              {/* Countdown Timer Placeholder */}
              <div className="absolute top-2 right-2 bg-background text-foreground text-xs px-2 py-1 rounded z-10">02:34:55</div>
              <Image src={p.imageUrls[0]} alt={p.name} width={300} height={400} className="w-full h-48 sm:h-60 object-cover group-hover:scale-105 transition-transform" data-ai-hint={p.dataAiHint || "product deal"}/>
              <CardContent className="p-3">
                <h3 className="text-sm sm:text-base font-semibold truncate group-hover:text-primary">{p.name}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-md sm:text-lg font-bold text-primary">Rs. {p.price.toFixed(2)}</p>
                  {p.originalPrice && <p className="text-xs sm:text-sm text-muted-foreground line-through">Rs. {p.originalPrice.toFixed(2)}</p>}
                </div>
                <Button variant="default" size="sm" className="w-full mt-2 text-xs bg-primary hover:bg-primary/90">Grab Now</Button>
              </CardContent>
             </Link>
           </Card>
        ))}
      </div>
    ) : <p className="text-center text-muted-foreground">No deals today. Check back soon!</p>}
  </section>
);

const Advertisements = () => (
  <section className="my-8 sm:my-12 space-y-6">
    {/* Leaderboard */}
    <div className="bg-neutral-800 h-[90px] w-full max-w-[728px] mx-auto flex items-center justify-center text-muted-foreground rounded text-sm" data-ai-hint="advertisement banner">Leaderboard Ad (728x90) - Promotion 1</div>
    {/* Text Banner */}
    <div className="bg-background text-foreground h-8 flex items-center justify-center overflow-hidden border-y border-border">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm">New Arrivals in Photo Gifts! Check them out now!</span>
        <span className="mx-4 text-sm">Special Discount on Corporate Bulk Orders!</span>
        <span className="mx-4 text-sm">Valentine's Day Specials - Up to 50% Off!</span>
      </div>
    </div>
    {/* Medium Rectangle */}
    <div className="bg-neutral-800 h-[250px] w-full max-w-[300px] mx-auto flex items-center justify-center text-muted-foreground rounded text-sm" data-ai-hint="advertisement square">Medium Rectangle Ad (300x250) - Corporate Bulk Offers</div>
    <style jsx>{`
      .animate-marquee {
        animation: marquee 20s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `}</style>
  </section>
);

const BestSellersAndTrending = ({products}: {products: Product[]}) => (
 <section className="my-8 sm:my-12">
    <Tabs defaultValue="bestsellers" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-neutral-800 text-foreground">
        <TabsTrigger value="bestsellers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Best Sellers</TabsTrigger>
        <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Trending Now</TabsTrigger>
      </TabsList>
      <TabsContent value="bestsellers" className="mt-6">
        <ProductList products={products.filter(p => p.popularity > 90).slice(0,4)} />
      </TabsContent>
      <TabsContent value="trending" className="mt-6">
         <ProductList products={products.filter(p => p.trending).slice(0,4)} />
      </TabsContent>
    </Tabs>
  </section>
);

const FestivalSpecials = () => (
  <section className="my-8 sm:my-12">
    <SectionTitle>Festival Specials</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-primary-foreground p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="diwali festival offer">
            <h3 className="text-xl font-bold">Diwali Dhamaka!</h3>
            <p className="text-sm">Up to 40% off on selected gifts.</p>
            <Button variant="secondary" className="mt-2 text-xs">Shop Diwali</Button>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="christmas holiday sale">
            <h3 className="text-xl font-bold">Christmas Cheer!</h3>
            <p className="text-sm">Find the perfect presents.</p>
            <Button variant="secondary" className="mt-2 text-xs bg-red-700 hover:bg-red-800">Shop Christmas</Button>
        </div>
         <div className="bg-pink-500 text-white p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="holi colors festival">
            <h3 className="text-xl font-bold">Holi Hai!</h3>
            <p className="text-sm">Colorful gifts for a vibrant celebration.</p>
            <Button variant="secondary" className="mt-2 text-xs bg-purple-600 hover:bg-purple-700">Shop Holi</Button>
        </div>
    </div>
  </section>
);

const OccasionSpotlight = () => (
  <section className="my-8 sm:my-12">
    <SectionTitle>Shop by Top Occasions</SectionTitle>
    <div className="relative">
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {OCCASIONS_LIST.slice(0, 10).map(occasion => {
          const OccIcon = occasion.Icon;
          return (
          <Link key={occasion.id} href={`/products?occasion=${occasion.slug}`} className="flex-shrink-0 w-24 sm:w-28">
            <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-neutral-800 group hover:bg-neutral-700 transition-colors">
              {OccIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5"><OccIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground"/></div>}
              {!OccIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5 w-9 h-9 sm:w-11 sm:w-11" data-ai-hint={occasion.dataAiHint || "occasion icon"}></div>}
              <span className="text-xs sm:text-sm text-center text-foreground group-hover:text-primary transition-colors">{occasion.name}</span>
            </div>
          </Link>
        )})}
      </div>
    </div>
  </section>
);

const GiftTypeHighlight = () => {
    const featuredTypes = ['caricature', '3d-crystals', 'photo-frames'];
    const productsToShow = GIFT_TYPES_LIST.filter(gt => featuredTypes.includes(gt.slug));
    return (
    <section className="my-8 sm:my-12">
        <SectionTitle>Featured Gift Types</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {productsToShow.map(gt => {
                const GtIcon = gt.Icon;
                return (
                <Card key={gt.id} className="bg-card text-card-foreground group">
                     <Link href={`/products?category=${gt.slug}`} className="block">
                        {gt.trending && <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full z-10">Trending</div>}
                        {GtIcon ? <GtIcon className="w-full h-32 sm:h-40 object-contain p-4 text-primary" /> : <Image src="https://placehold.co/300x200.png" alt={gt.name} width={300} height={200} className="w-full h-32 sm:h-40 object-cover rounded-t-lg" data-ai-hint={gt.dataAiHint || "gift type"}/>}
                        <CardContent className="p-3 sm:p-4">
                            <h3 className="text-base sm:text-lg font-semibold text-card-foreground group-hover:text-primary">{gt.name}</h3>
                            <p className="text-primary text-xs sm:text-sm font-medium mt-1 group-hover:underline">Explore <ArrowRight className="inline h-3 w-3"/></p>
                        </CardContent>
                    </Link>
                </Card>
            )})}
        </div>
    </section>
    )
};

const RecipientQuickLinks = () => (
  <section className="my-8 sm:my-12">
    <SectionTitle>Gifts For</SectionTitle>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {RECIPIENTS_LIST.slice(0,12).map(recipient => {
            const RecipientIcon = recipient.Icon;
            return (
                <Link key={recipient.id} href={`/products?recipient=${recipient.slug}`} className="block">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-800 group hover:bg-neutral-700 transition-colors">
                        {RecipientIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5"><RecipientIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground"/></div>}
                         {!RecipientIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5 w-9 h-9 sm:w-11 sm:w-11" data-ai-hint={recipient.dataAiHint || "recipient icon"}></div>}
                        <span className="text-xs text-center text-foreground group-hover:text-primary transition-colors">{recipient.name}</span>
                    </div>
                </Link>
            )
        })}
    </div>
  </section>
);


export default function HomePage() {
  // Products for "Deal of the Day" would be fetched or filtered
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  useEffect(() => {
    setDealProducts(PRODUCTS.filter(p => p.originalPrice && p.price < p.originalPrice).sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <HeroCarousel />
      <ManualBannerSlot />
      <SmartFinderPanel />
      <OccasionSpotlight />
      <TopCurations />
      <GiftTypeHighlight />
      <DailySpotlight products={dealProducts} />
      <RecipientQuickLinks />
      <Advertisements />
      <BestSellersAndTrending products={PRODUCTS} />
      <FestivalSpecials />
    </div>
  );
}
