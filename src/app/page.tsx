
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product, Occasion, GiftType, Recipient } from '@/lib/types';
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import LottiePlayer from 'react-lottie-player';
import { ArrowRight, ChevronDown, Sparkles as SparklesIcon, Quote, Star as StarIconLucide, Gift, CalendarDays, PartyPopper, Heart, Briefcase, ToyBrick, Utensils, Gem, Camera, Lamp, Smile, ArrowRightCircle, Users, Award, Trophy, Rocket, GraduationCap, Shield, ShoppingBag, Feather, Star as StarLucide, User, Diamond, Plane, Baby, Flower, Palette, Music, Package, Anchor, Pencil, ThumbsUp, Leaf, Medal, Moon, Newspaper, Pin, School, Search, Sprout, Store, Sun, Tag, Ticket, TreeDeciduous, Wand, Watch, Wind, Wine, Zap, Home as HomeIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/products/ProductCard';

interface CarouselBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  gradientClasses: string;
}

const carouselBannersData: CarouselBanner[] = [
  {
    id: 1,
    title: "Personalized Magic",
    description: "Unique gifts that tell their story.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "personalized gift assortment",
    gradientClasses: "bg-gradient-to-br from-red-600 via-pink-600 to-fuchsia-700",
  },
  {
    id: 2,
    title: "Celebrate Every Moment",
    description: "Find the perfect gift for any occasion.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "birthday celebration gifts",
    gradientClasses: "bg-gradient-to-tr from-rose-500 via-red-500 to-orange-600",
  },
  {
    id: 3,
    title: "3D Wonders",
    description: "Lifelike miniatures and stunning crystal art.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "3d crystal miniature",
    gradientClasses: "bg-gradient-to-b from-neutral-800 via-red-900 to-black",
  },
  {
    id: 4,
    title: "Frame Your Memories",
    description: "Elegant photo frames for timeless keepsakes.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "photo frame collection",
    gradientClasses: "bg-gradient-to-bl from-red-700 via-rose-800 to-neutral-900",
  },
  {
    id: 5,
    title: "Corporate Gifting",
    description: "Impress clients with premium, branded gifts.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "corporate gift basket",
    gradientClasses: "bg-gradient-to-tl from-neutral-900 via-gray-800 to-red-900",
  },
  {
    id: 6,
    title: "Just For You",
    description: "Handpicked selections for every recipient.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "gift for her",
    gradientClasses: "bg-gradient-to-r from-pink-700 via-red-600 to-rose-700",
  },
  {
    id: 7,
    title: "Daily Deals",
    description: "Unbeatable prices on popular gifts, daily.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "gift sale discount",
    gradientClasses: "bg-gradient-to-l from-orange-600 via-red-500 to-pink-500",
  },
  {
    id: 8,
    title: "New Arrivals",
    description: "Fresh designs and innovative gift ideas.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "new product launch",
    gradientClasses: "bg-gradient-to-br from-fuchsia-700 via-purple-600 to-red-500",
  },
  {
    id: 9,
    title: "Artistic Touch",
    description: "Transform photos into unique art pieces.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "photo to art canvas",
    gradientClasses: "bg-gradient-to-tr from-red-800 via-neutral-900 to-rose-700",
  },
  {
    id: 10,
    title: "Miniature You!",
    description: "Get a custom 3D miniature of yourself or loved ones.",
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "3d selfie miniature",
    gradientClasses: "bg-gradient-to-bl from-rose-600 via-red-700 to-pink-800",
  },
];

const HeroCarouselButton = () => {
  return (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 rounded-md px-6 py-3 sm:px-8 sm:py-3.5">
      <Link href="/products">Shop Now</Link>
    </Button>
  );
};

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselBannersData.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const bannerAnimationInactiveClasses = "opacity-0";
  const bannerAnimationActiveClasses = "opacity-100";
  const bannerBaseTransition = "transition-opacity duration-[2000ms] ease-in-out";

  const commonTextInactiveAnimation = "opacity-0";
  const commonTextActiveAnimation = "opacity-100";

  const iconBaseTransition = "transition-opacity duration-[1200ms] ease-out delay-[300ms]";
  const titleBaseTransition = "transition-opacity duration-[1200ms] ease-out delay-[450ms]";
  const descriptionBaseTransition = "transition-opacity duration-[1200ms] ease-out delay-[600ms]";
  const buttonBaseTransition = "transition-opacity duration-[1200ms] ease-out delay-[750ms]";


  return (
    <section className="relative min-h-[400px] md:min-h-[500px] w-full mb-8 sm:mb-12 rounded-lg overflow-hidden">
      {carouselBannersData.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 w-full h-full flex p-6 md:p-10",
            banner.gradientClasses,
            'items-start',
            bannerBaseTransition,
            index === currentSlide ? bannerAnimationActiveClasses : bannerAnimationInactiveClasses + " pointer-events-none"
          )}
        >
          <div className={cn("relative z-10 w-full flex justify-start")}>
            <div className="max-w-md md:max-w-lg lg:max-w-xl text-left">
              <SparklesIcon className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 text-white opacity-70 mb-2 sm:mb-3 hidden md:inline-block",
                iconBaseTransition,
                index === currentSlide ? commonTextActiveAnimation : commonTextInactiveAnimation
                )} />
              <h1 className={cn(
                "font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 text-white",
                "text-left",
                titleBaseTransition,
                index === currentSlide ? commonTextActiveAnimation : commonTextInactiveAnimation
                )}>
                {banner.title}
              </h1>
              <p className={cn(
                "text-neutral-200 text-sm sm:text-base lg:text-md max-w-md mb-6 sm:mb-8",
                 "mr-auto",
                descriptionBaseTransition,
                index === currentSlide ? commonTextActiveAnimation : commonTextInactiveAnimation
                )}>
                {banner.description}
              </p>
              <div className={cn(
                  buttonBaseTransition,
                  index === currentSlide ? commonTextActiveAnimation : commonTextInactiveAnimation
              )}>
                <HeroCarouselButton />
              </div>
            </div>
          </div>
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover opacity-20 pointer-events-none"
            data-ai-hint={banner.dataAiHint}
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {carouselBannersData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};


const priceRangeOptions = [
  { value: 'all', label: 'All Prices' },
  { value: '0-99', label: 'Below Rs. 100' },
  { value: '100-250', label: 'Rs. 100 - Rs. 250' },
  { value: '250-500', label: 'Rs. 250 - Rs. 500' },
  { value: '500-750', label: 'Rs. 500 - Rs. 750' },
  { value: '750-1000', label: 'Rs. 750 - Rs. 1000' },
  { value: '1000-2500', label: 'Rs. 1000 - Rs. 2500' },
  { value: '2500-5000', label: 'Rs. 2500 - Rs. 5000' },
  { value: '5000-Infinity', label: 'Above Rs. 5000' },
];

const SmartFinderPanel = () => {
  const router = useRouter();

  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedGiftType, setSelectedGiftType] = useState<string>('all');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
  const [selectedPriceRangeKey, setSelectedPriceRangeKey] = useState<string>('all');

  const handleFindGifts = () => {
    const queryParams = new URLSearchParams();
    if (selectedOccasion && selectedOccasion !== 'all') {
      queryParams.append('occasion', selectedOccasion);
    }
    if (selectedGiftType && selectedGiftType !== 'all') {
      queryParams.append('category', selectedGiftType);
    }
    if (selectedRecipient && selectedRecipient !== 'all') {
      queryParams.append('recipient', selectedRecipient);
    }

    if (selectedPriceRangeKey && selectedPriceRangeKey !== 'all') {
      const parts = selectedPriceRangeKey.split('-');
      const minPrice = parseInt(parts[0], 10);
      const maxPrice = parts[1] === 'Infinity' ? Number.MAX_SAFE_INTEGER : parseInt(parts[1], 10);
      queryParams.append('priceMin', minPrice.toString());
      queryParams.append('priceMax', maxPrice.toString());
    } else {
        queryParams.append('priceMin', '0');
        queryParams.append('priceMax', Number.MAX_SAFE_INTEGER.toString());
    }
    router.push(`/products?${queryParams.toString()}`);
  };

  return (
    <section className="bg-secondary py-6 sm:py-8 my-8 sm:my-12 rounded-lg shadow-xl">
      <div className="container mx-auto px-4">
        <SectionTitle className="text-white mb-6 sm:mb-8 text-2xl sm:text-3xl">Find The Perfect Gift</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">

          <div className="space-y-1.5">
            <Label htmlFor="smart-occasion" className="text-sm font-medium text-neutral-300">Occasion</Label>
            <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
              <SelectTrigger id="smart-occasion" className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-11 text-sm">
                <SelectValue placeholder="Select Occasion" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-border">
                <SelectItem value="all" className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">All Occasions</SelectItem>
                {OCCASIONS_LIST.map(o => <SelectItem key={o.id} value={o.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{o.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smart-gift-type" className="text-sm font-medium text-neutral-300">Gift Type</Label>
            <Select value={selectedGiftType} onValueChange={setSelectedGiftType}>
              <SelectTrigger id="smart-gift-type" className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-11 text-sm">
                <SelectValue placeholder="Select Gift Type" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-border">
                <SelectItem value="all" className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">All Gift Types</SelectItem>
                {GIFT_TYPES_LIST.map(gt => <SelectItem key={gt.id} value={gt.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{gt.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smart-recipient" className="text-sm font-medium text-neutral-300">Recipient</Label>
            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger id="smart-recipient" className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-11 text-sm">
                <SelectValue placeholder="Select Recipient" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-border">
                <SelectItem value="all" className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">Any Recipient</SelectItem>
                {RECIPIENTS_LIST.map(r => <SelectItem key={r.id} value={r.slug} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="smart-price-range" className="text-sm font-medium text-neutral-300">Price Range</Label>
            <Select value={selectedPriceRangeKey} onValueChange={setSelectedPriceRangeKey}>
              <SelectTrigger id="smart-price-range" className="w-full bg-black text-white border-border placeholder:text-neutral-400 focus:ring-primary h-11 text-sm">
                <SelectValue placeholder="Select Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-border">
                {priceRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-neutral-800 focus:bg-neutral-700 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
         <div className="mt-8 text-center">
            <Button onClick={handleFindGifts} size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground text-base px-10 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              Find Gifts
            </Button>
        </div>
      </div>
    </section>
  )
};

const TopCurations = () => {
  const curations = [
    { name: 'Occasion', Icon: CalendarDays, slug:'all', type: 'occasion' },
    { name: 'Birthday', Icon: PartyPopper, slug:'birthday', type: 'occasion' },
    { name: 'Anniversary', Icon: Heart, slug:'anniversary', type: 'occasion' },
    { name: 'Corporate', Icon: Briefcase, slug:'premium-gifts', type: 'giftType' },
    { name: 'Personalized', Icon: SparklesIcon, slug:'photo-gifts', type: 'giftType' },
    { name: 'Miniature', Icon: ToyBrick, slug:'miniature', type: 'giftType' },
  ];
  return (
    <section className="my-8 sm:my-12">
      <SectionTitle className="text-white">Top Curations</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {curations.map(item => {
          const ItemIcon = item.Icon;
          const link = item.type === 'occasion' ? `/products?occasion=${item.slug}` : `/products?category=${item.slug}`;
          return (
            <Link key={item.name} href={link} passHref
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
            >
              <div className={cn(
                "bg-neutral-800 p-4 sm:p-6 rounded-xl aspect-square flex flex-col items-center justify-center text-center overflow-hidden",
                "transition-all duration-300 ease-out",
                "group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105"
              )}>
                <div className={cn(
                  "bg-neutral-700 p-3 sm:p-4 rounded-full mb-3 sm:mb-4",
                  "transition-all duration-300 ease-out",
                  "group-hover:bg-white/20 group-hover:scale-110"
                )}>
                  {ItemIcon && <ItemIcon className={cn(
                    "h-7 w-7 sm:h-8 w-8 text-primary",
                    "transition-all duration-500 ease-out",
                    "group-hover:text-white group-hover:rotate-[360deg]"
                   )} />}
                </div>
                <h3 className={cn(
                  "font-semibold text-neutral-200 text-sm sm:text-base leading-tight",
                  "transition-colors duration-300 ease-out",
                  "group-hover:text-primary-foreground group-hover:font-bold"
                  )}>
                  {item.name}
                </h3>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
};

const TrendingSpotlight = ({ products }: { products: Product[] }) => {
  const productsToShow = products.slice(0, 8);
  return (
  <section className="my-8 sm:my-12">
    <SectionTitle className="text-white">Spotlight Steals</SectionTitle>
    {productsToShow.length > 0 ? (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {productsToShow.map(p => (
             <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground text-base px-10 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Link href="/products?sort=trending">
                Explore Spotlight Gifts
              </Link>
            </Button>
        </div>
      </>
    ) : <p className="text-center text-muted-foreground">No spotlight items today. Check back soon!</p>}
  </section>
  );
};


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
    }, 10000);

    return () => clearInterval(timer);
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

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "The personalized caricature was a huge hit at the birthday party! Amazing quality and super fast delivery.",
      author: "Priya S.",
      tag: "Loved It!",
      tagColor: "bg-green-500",
      rating: 5,
    },
    {
      id: 2,
      quote: "I ordered a 3D crystal for our anniversary, and it was breathtaking. Such a unique and memorable gift.",
      author: "Amit K.",
      tag: "Perfect Gift!",
      tagColor: "bg-blue-500",
      rating: 5,
    },
    {
      id: 3,
      quote: "The customer service was fantastic in helping me choose the right photo frame. The final product was beautiful.",
      author: "Rina M.",
      tag: "Great Service!",
      tagColor: "bg-yellow-500",
      rating: 4,
    },
     {
      id: 4,
      quote: "My team loved the custom mugs for our corporate event. Excellent branding and durable quality.",
      author: "Vikram R., CEO",
      tag: "Highly Recommend",
      tagColor: "bg-purple-500",
      rating: 5,
    }
  ];

  return (
    <section className="my-8 sm:my-12">
      <SectionTitle className="text-white mb-8">Words from Our Happy Gifting Community</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="bg-neutral-800 border-neutral-700 shadow-xl flex flex-col hover:shadow-primary/30 transition-shadow duration-300">
            <CardContent className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <Quote className="w-8 h-8 text-primary opacity-50 transform -scale-x-100" />
                {testimonial.tag && (
                  <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${testimonial.tagColor}`}>
                    {testimonial.tag}
                  </span>
                )}
              </div>
              <p className="text-neutral-300 italic text-sm sm:text-base leading-relaxed mb-4 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">{testimonial.author}</p>
                    {testimonial.rating && (
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIconLucide key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`} />
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const OccasionSpotlight = () => {
  const occasionsToDisplay = OCCASIONS_LIST.slice(0, 10);
  const marqueeItems = [...occasionsToDisplay, ...occasionsToDisplay]; 

  return (
    <section className="my-8 sm:my-12">
      <SectionTitle className="text-white">Shop by Top Occasions</SectionTitle>
      <div className="relative overflow-hidden group/marquee">
        <div className="flex animate-marquee-horizontal group-hover/marquee:[animation-play-state:paused] whitespace-nowrap py-2">
          {marqueeItems.map((occasion, index) => {
            const OccIcon = occasion.Icon;
            const uniqueKey = `${occasion.id}-${index}`;
            return (
              <Link
                key={uniqueKey}
                href={`/products?occasion=${occasion.slug}`}
                className="group/item flex-shrink-0 w-36 h-40 mx-2"
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg bg-neutral-800 text-center h-full",
                    "transition-all duration-300 ease-in-out",
                    "border-2 border-transparent",
                    "group-hover/item:bg-primary/80 group-hover/item:shadow-xl group-hover/item:shadow-primary/30 group-hover/item:scale-105 group-hover/item:border-primary"
                  )}
                >
                  {occasion.lottieAnimationUrl ? (
                    <LottiePlayer
                      path={occasion.lottieAnimationUrl}
                      play
                      loop
                      style={{ width: 48, height: 48, marginBottom: '0.75rem' }}
                      className={cn(
                        "transition-opacity duration-300 group-hover/item:opacity-80"
                      )}
                    />
                  ) : OccIcon ? (
                    <OccIcon
                      className={cn(
                        "h-12 w-12 text-primary mb-3",
                        "transition-colors duration-300 group-hover/item:text-primary-foreground"
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-12 w-12 rounded-md bg-muted flex items-center justify-center mb-3",
                        "transition-colors duration-300 group-hover/item:bg-primary/20 group-hover/item:text-primary-foreground"
                      )}
                      data-ai-hint={occasion.dataAiHint || "occasion gift icon"}
                    >
                      <Gift className="h-7 w-7 text-muted-foreground group-hover/item:text-primary-foreground" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium text-neutral-200 line-clamp-2",
                      "transition-colors duration-300 group-hover/item:text-primary-foreground"
                    )}
                  >
                    {occasion.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GiftQuoteBanners = () => {
  const quoteBanners = [
    { 
      id: 1, 
      text: "The best gifts come from the heart, not the store.", 
      lottieAnimationUrl: "https://lottie.host/801a2a89-3221-4f13-8877-353d537f190e/g9z4J8wY0Z.json",
      textColorClass: "text-white" 
    },
    { 
      id: 2, 
      text: "Every gift from a friend is a wish for your happiness.", 
      lottieAnimationUrl: "https://lottie.host/8aa22f51-a212-4f34-8c81-801c40b82f8a/xmsL0jKA7z.json",
      textColorClass: "text-neutral-100" 
    },
    { 
      id: 3, 
      text: "A gift is a wish for happiness.",  
      lottieAnimationUrl: "https://lottie.host/b8e0a1f2-1f7c-473a-ba92-23746797825b/1z2Y3x4W5v.json",
      textColorClass: "text-white" 
    },
    { 
      id: 4, 
      text: "The excellence of a gift lies in its appropriateness rather than in its value.", 
      lottieAnimationUrl: "https://lottie.host/5e0f7f3a-9c29-4b95-8a8e-2f5a6e4d3c2b/oPqRsTuVwX.json",
      textColorClass: "text-neutral-100" 
    },
    { 
      id: 5, 
      text: "The manner of giving is worth more than the gift.", 
      lottieAnimationUrl: "https://lottie.host/c4a3b2b1-d5e6-4f7a-8b9c-0d1e2f3a4b5c/AbCdEfGhIj.json",
      textColorClass: "text-white" 
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % quoteBanners.length);
    }, 10000); 

    return () => clearInterval(timer);
  }, [quoteBanners.length]);

  useEffect(() => {
    const currentBanner = quoteBanners[currentBannerIndex];
    if (currentBanner.lottieAnimationUrl) {
      setLottieData(null); // Clear previous animation data
      fetch(currentBanner.lottieAnimationUrl)
        .then(response => response.json())
        .then(data => setLottieData(data))
        .catch(error => {
          console.error("Error fetching Lottie animation:", error);
          setLottieData(null); 
        });
    } else {
      setLottieData(null);
    }
  }, [currentBannerIndex, quoteBanners]);


  const currentBanner = quoteBanners[currentBannerIndex];

  return (
    <section className="my-8 sm:my-12">
      <div
        key={currentBanner.id} 
        className={cn(
          "w-full h-20 sm:h-24 md:h-28 flex items-center justify-center p-4 rounded-lg shadow-md relative overflow-hidden",
          "bg-neutral-800" 
        )}
      >
        {lottieData && (
          <LottiePlayer
            animationData={lottieData}
            play
            loop
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              objectFit: 'cover',
            }}
          />
        )}
        <p className={cn(
          "text-sm sm:text-base md:text-lg font-medium text-center italic relative z-10", 
           currentBanner.textColorClass
           )}>
          "{currentBanner.text}"
        </p>
      </div>
    </section>
  );
};


const GiftTypeHighlight = () => {
    const featuredTypes = ['caricature', '3d-crystals', 'photo-frames', 'miniature', 'custom-mugs', '3d-lamps'];
    const productsToShow = GIFT_TYPES_LIST.filter(gt => featuredTypes.includes(gt.slug));

    return (
    <section className="my-8 sm:my-12">
        <SectionTitle className="text-white">Featured Gift Types</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {productsToShow.map(gt => {
                const imageHint = gt.dataAiHint || "gift category";
                return (
                  <Link key={gt.id} href={`/products?category=${gt.slug}`} className="block group">
                    <div className="bg-card p-3 rounded-lg transition-all duration-200 ease-in-out group-hover:bg-primary/5 group-hover:shadow-xl border border-border group-hover:border-primary/30">
                        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-3">
                            <Image
                                src="https://placehold.co/400x300.jpg"
                                alt={gt.name}
                                fill
                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                                data-ai-hint={imageHint}
                            />
                        </div>
                        <h3 className="text-sm font-medium text-card-foreground text-center truncate group-hover:text-primary transition-colors">
                            {gt.name}
                        </h3>
                    </div>
                  </Link>
            )})}
        </div>
    </section>
    )
};

const RecipientQuickLinks = () => {
  const marqueeRecipients = [...RECIPIENTS_LIST, ...RECIPIENTS_LIST]; 

  return (
    <section className="my-8 sm:my-12">
      <SectionTitle className="text-white">Who's it For?</SectionTitle>
      <div className="relative overflow-hidden group/marquee">
        <div className="flex animate-marquee-horizontal-reverse group-hover/marquee:[animation-play-state:paused] whitespace-nowrap py-2">
          {marqueeRecipients.map((recipient, index) => {
            const uniqueKey = `${recipient.id}-${index}`;
            return (
              <Link
                key={uniqueKey}
                href={`/products?recipient=${recipient.slug}`}
                className="group/item flex-shrink-0 w-36 mx-2" 
              >
                <div
                  className={cn(
                    "bg-neutral-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out group",
                    "border-2 border-transparent group-hover/item:-translate-y-1 group-hover/item:shadow-xl group-hover/item:border-primary"
                  )}
                >
                  <div className="relative w-full aspect-[1/1]"> 
                    <Image
                      src={`https://placehold.co/200x200.jpg`}
                      alt={recipient.name}
                      fill
                      className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                      data-ai-hint={recipient.dataAiHint || "recipient image"}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className={cn(
                      "text-sm font-medium text-neutral-200 truncate",
                      "transition-colors duration-300 group-hover/item:text-primary"
                    )}>
                      {recipient.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};


export default function HomePage()
{
  const [spotlightProducts, setSpotlightProducts] = useState<Product[]>([]);
  useEffect(() => {
    setSpotlightProducts(
      PRODUCTS.filter(p => p.trending)
              .sort((a,b) => b.popularity - a.popularity)
    );
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <HeroCarousel />
      <SmartFinderPanel />
      <OccasionSpotlight />
      <GiftQuoteBanners />
      <TopCurations />
      <GiftTypeHighlight />
      <TrendingSpotlight products={spotlightProducts} />
      <RecipientQuickLinks />
      <Advertisements />
      <TestimonialsSection />
    </div>
  );
}

