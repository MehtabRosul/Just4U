
"use client";

import { useState, useEffect } from 'react';
import type { Product, Occasion, GiftType, Recipient } from '@/lib/types';
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Sparkles as SparklesIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

const HeroCarousel = () => (
  <section className="relative bg-gradient-to-b from-red-900 via-red-950 to-black min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center mb-8 sm:mb-12 py-10 sm:py-16 rounded-lg overflow-hidden">
    <div className="relative z-10 p-4 flex flex-col items-center">
      <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400 opacity-70 mb-2 sm:mb-4" />
      <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-pink-500 to-fuchsia-500 text-transparent bg-clip-text">
        Gifts as Unique <br className="md:hidden" /> as They Are
      </h1>
      <p className="text-neutral-300 text-sm sm:text-base lg:text-lg max-w-md mx-auto mb-6 sm:mb-8">
        Discover a world of personalized treasures, crafted with love for every occasion and every special someone.
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 rounded-md px-6 py-3 sm:px-8 sm:py-3.5">
        <Link href="/products">Grab Yours</Link>
      </Button>
    </div>
  </section>
);

const SmartFinderPanel = () => {
  const [priceRange, setPriceRange] = useState([50, 300]);
  return (
    <section className="bg-neutral-900 py-6 sm:py-8 my-8 sm:my-12 rounded-lg">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-white mb-4 sm:mb-6 text-xl sm:text-2xl">Find The Perfect Gift</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
          <Select>
            <SelectTrigger className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Occasion" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-border">
              {OCCASIONS_LIST.slice(0,5).map(o => <SelectItem key={o.id} value={o.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Gift Type" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-border">
              {GIFT_TYPES_LIST.slice(0,5).map(gt => <SelectItem key={gt.id} value={gt.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{gt.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-10 text-sm">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-border">
              {RECIPIENTS_LIST.slice(0,5).map(r => <SelectItem key={r.id} value={r.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="sm:col-span-2 md:col-span-1">
            <label className="text-xs text-neutral-400 mb-1 block">Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}</label>
            <Slider
              defaultValue={[50, 300]}
              min={0} max={1000} step={10}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="[&>span:first-child]:bg-primary [&>span:first-child_span]:bg-white"
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
      <SectionTitle className="text-white">Top Curations</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {curations.map(item => {
          const ItemIcon = item.Icon;
          const link = item.type === 'occasion' ? `/products?occasion=${item.slug}` : `/products?category=${item.slug}`;
          return (
            <Link key={item.name} href={link} passHref>
              <Card className="bg-neutral-800 text-center p-3 sm:p-4 rounded-lg hover:shadow-lg transition-shadow group">
                <CardContent className="flex flex-col items-center justify-center space-y-2">
                  {ItemIcon && <div className="bg-primary p-2 sm:p-3 rounded-full mb-1 sm:mb-2"><ItemIcon className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" /></div>}
                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-primary transition-colors">{item.name}</h3>
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
    <SectionTitle className="text-white">Just for Today</SectionTitle>
    {products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0,4).map(p => (
           <Card key={p.id} className="bg-card text-card-foreground overflow-hidden relative group">
             <Link href={`/products/${p.slug}`} className="block">
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded z-10">Deal of the Day</div>
              <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded z-10">02:34:55</div>
              <Image src={p.imageUrls[0]} alt={p.name} width={300} height={400} className="w-full h-48 sm:h-60 object-cover group-hover:scale-105 transition-transform" data-ai-hint={p.dataAiHint || "product deal"}/>
              <CardContent className="p-3 bg-white">
                <h3 className="text-sm sm:text-base font-semibold truncate group-hover:text-primary text-black">{p.name}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-md sm:text-lg font-bold text-primary">Rs. {p.price.toFixed(2)}</p>
                  {p.originalPrice && <p className="text-xs sm:text-sm text-neutral-500 line-through">Rs. {p.originalPrice.toFixed(2)}</p>}
                </div>
                <Button variant="default" size="sm" className="w-full mt-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">Grab Now</Button>
              </CardContent>
             </Link>
           </Card>
        ))}
      </div>
    ) : <p className="text-center text-muted-foreground">No deals today. Check back soon!</p>}
  </section>
);

const Advertisements = () => {
  const bannerMessages = [
    { id: 1, text: "Grand Opening Sale! Up to 50% Off Selected Gifts!", bgColor: "bg-red-600", textColor: "text-white" },
    { id: 2, text: "New Arrivals: Personalized Miniatures - Create Yours Today!", bgColor: "bg-blue-600", textColor: "text-white" },
    { id: 3, text: "Corporate Gifting Solutions - Impress Your Clients & Employees.", bgColor: "bg-green-600", textColor: "text-white" },
    { id: 4, text: "Express Delivery Available for Last Minute Gifts!", bgColor: "bg-yellow-500", textColor: "text-black" },
    { id: 5, text: "Join Our Loyalty Program and Earn Rewards with Every Purchase!", bgColor: "bg-purple-600", textColor: "text-white" },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerMessages.length);
    }, 10000); // Change banner every 10 seconds

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  const currentBanner = bannerMessages[currentBannerIndex];

  return (
    <section className="my-8 sm:my-12">
      <div
        className={`w-full h-24 sm:h-28 md:h-32 flex items-center justify-center p-4 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${currentBanner.bgColor} ${currentBanner.textColor}`}
        data-ai-hint="promotional banner"
      >
        <p className="text-base sm:text-lg md:text-xl font-semibold text-center">
          {currentBanner.text}
        </p>
      </div>
    </section>
  );
};


const BestSellersAndTrending = ({products}: {products: Product[]}) => (
 <section className="my-8 sm:my-12">
    <Tabs defaultValue="bestsellers" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-black text-white">
        <TabsTrigger value="bestsellers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:underline data-[state=active]:decoration-primary data-[state=active]:decoration-2 data-[state=active]:underline-offset-4">Best Sellers</TabsTrigger>
        <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:underline data-[state=active]:decoration-primary data-[state=active]:decoration-2 data-[state=active]:underline-offset-4">Trending Now</TabsTrigger>
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
    <SectionTitle className="text-white">Festival Specials</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-primary-foreground p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="diwali festival offer">
            <h3 className="text-xl font-bold">Diwali Dhamaka!</h3>
            <p className="text-sm">Up to 40% off on selected gifts.</p>
            <Button variant="secondary" className="mt-2 text-xs bg-white text-black hover:bg-neutral-200">Shop Diwali</Button>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="christmas holiday sale">
            <h3 className="text-xl font-bold">Christmas Cheer!</h3>
            <p className="text-sm">Find the perfect presents.</p>
            <Button variant="secondary" className="mt-2 text-xs bg-red-700 hover:bg-red-800 text-white">Shop Christmas</Button>
        </div>
         <div className="bg-pink-500 text-white p-6 rounded-lg h-40 flex flex-col justify-center items-center text-center" data-ai-hint="holi colors festival">
            <h3 className="text-xl font-bold">Holi Hai!</h3>
            <p className="text-sm">Colorful gifts for a vibrant celebration.</p>
            <Button variant="secondary" className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white">Shop Holi</Button>
        </div>
    </div>
  </section>
);

const OccasionSpotlight = () => (
  <section className="my-8 sm:my-12">
    <SectionTitle className="text-white">Shop by Top Occasions</SectionTitle>
    <div className="relative">
      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {OCCASIONS_LIST.slice(0, 10).map(occasion => {
          const OccIcon = occasion.Icon;
          return (
          <Link key={occasion.id} href={`/products?occasion=${occasion.slug}`} className="flex-shrink-0 w-24 sm:w-28">
            <div className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-neutral-800 group hover:bg-neutral-700 transition-colors">
              {OccIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5"><OccIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground"/></div>}
              {!OccIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5 w-9 h-9 sm:w-11 sm:w-11" data-ai-hint={occasion.dataAiHint || "occasion icon"}></div>}
              <span className="text-xs sm:text-sm text-center text-white group-hover:text-primary transition-colors">{occasion.name}</span>
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
        <SectionTitle className="text-white">Featured Gift Types</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {productsToShow.map(gt => {
                const GtIcon = gt.Icon;
                return (
                <Card key={gt.id} className="bg-card text-card-foreground group">
                     <Link href={`/products?category=${gt.slug}`} className="block">
                        {gt.trending && <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full z-10">Trending</div>}
                        {GtIcon ? <GtIcon className="w-full h-32 sm:h-40 object-contain p-4 text-primary" /> : <Image src="https://placehold.co/300x200.png" alt={gt.name} width={300} height={200} className="w-full h-32 sm:h-40 object-cover rounded-t-lg" data-ai-hint={gt.dataAiHint || "gift type"}/>}
                        <CardContent className="p-3 sm:p-4 bg-white">
                            <h3 className="text-base sm:text-lg font-semibold text-black group-hover:text-primary">{gt.name}</h3>
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
    <SectionTitle className="text-white">Gifts For</SectionTitle>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {RECIPIENTS_LIST.slice(0,12).map(recipient => {
            const RecipientIcon = recipient.Icon;
            return (
                <Link key={recipient.id} href={`/products?recipient=${recipient.slug}`} className="block">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-800 group hover:bg-neutral-700 transition-colors">
                        {RecipientIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5"><RecipientIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground"/></div>}
                         {!RecipientIcon && <div className="bg-primary p-2 sm:p-2.5 rounded-full mb-1 sm:mb-1.5 w-9 h-9 sm:w-11 sm:w-11" data-ai-hint={recipient.dataAiHint || "recipient icon"}></div>}
                        <span className="text-xs text-center text-white group-hover:text-primary transition-colors">{recipient.name}</span>
                    </div>
                </Link>
            )
        })}
    </div>
  </section>
);


export default function HomePage()
{
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  useEffect(() => {
    setDealProducts(PRODUCTS.filter(p => p.originalPrice && p.price < p.originalPrice).sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <HeroCarousel />
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
    