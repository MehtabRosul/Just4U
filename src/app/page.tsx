
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product, Occasion, GiftType, Recipient } from '@/lib/types';
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Sparkles as SparklesIcon, Quote, Star as StarIconLucide, Gift, CalendarDays, PartyPopper, Heart, Briefcase, ToyBrick, Utensils, Gem, Camera, Lamp, Smile, ArrowRightCircle, Users, Award, Trophy, Rocket, GraduationCap, Shield, ShoppingBag, Feather, Star as StarLucide, User, Diamond, Plane, Baby, Flower, Palette, Music, Package, Anchor, Pencil, ThumbsUp, Leaf, Medal, Moon, Newspaper, Pin, School, Search, Sprout, Store, Sun, Tag, Ticket, TreeDeciduous, Wand, Watch, Wind, Wine, Zap, HomeIcon as HomeIconLucide } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { ProductCard } from '@/components/products/ProductCard';
import { useToast } from "@/hooks/use-toast";


interface CarouselBanner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  gradientClasses: string;
  titleTextClass?: string;
  descriptionTextClass?: string;
}

const carouselBannersData: CarouselBanner[] = [
  {
    id: 1,
    title: "Personalized Magic",
    description: "Unique gifts that tell their story. Find the perfect custom present today!",
    imageUrl: "https://i.ibb.co/gv62ZJ0/pexels-arina-krasnikova-5422790-1.jpg",
    dataAiHint: "personalized gift assortment",
    gradientClasses: "bg-gradient-to-br from-purple-600 via-pink-500 to-rose-600",
    titleTextClass: "text-white",
    descriptionTextClass: "text-rose-100",
  },
  {
    id: 2,
    title: "Celebrate Every Moment",
    description: "Find the perfect gift for any occasion, from birthdays to anniversaries.",
    imageUrl: "https://i.ibb.co/yY5QxV1/pexels-antoni-shkraba-4347872-1.jpg",
    dataAiHint: "birthday celebration gifts",
    gradientClasses: "bg-gradient-to-tr from-teal-500 via-cyan-500 to-sky-500",
    titleTextClass: "text-white",
    descriptionTextClass: "text-sky-100",
  },
  {
    id: 3,
    title: "3D Wonders",
    description: "Lifelike miniatures and stunning crystal art that capture memories in three dimensions.",
    imageUrl: "https://i.ibb.co/3RkC7j8/pexels-ann-h-45017-16070854-1.jpg",
    dataAiHint: "3d crystal miniature",
    gradientClasses: "bg-gradient-to-b from-indigo-500 via-purple-600 to-pink-600",
    titleTextClass: "text-white",
    descriptionTextClass: "text-pink-100",
  },
  {
    id: 4,
    title: "Frame Your Memories",
    description: "Elegant photo frames for timeless keepsakes. Personalize your favorite moments.",
    imageUrl: "https://i.ibb.co/mH9c1tH/pexels-ketut-subiyanto-4350108-1.jpg",
    dataAiHint: "photo frame collection",
    gradientClasses: "bg-gradient-to-bl from-green-500 via-lime-500 to-yellow-400",
    titleTextClass: "text-neutral-800",
    descriptionTextClass: "text-green-900",
  },
  {
    id: 5,
    title: "Corporate Gifting",
    description: "Impress clients and reward employees with premium, branded corporate gifts.",
    imageUrl: "https://i.ibb.co/vVmsZ1f/pexels-karolina-grabowska-4491444-1.jpg",
    dataAiHint: "corporate gift basket",
    gradientClasses: "bg-gradient-to-tl from-blue-600 via-indigo-500 to-purple-500",
    titleTextClass: "text-white",
    descriptionTextClass: "text-purple-100",
  },
  {
    id: 6,
    title: "Just For You",
    description: "Handpicked selections for every recipient. Find a gift that speaks from the heart.",
    imageUrl: "https://i.ibb.co/8XnQhBv/pexels-ron-lach-7871177-1.jpg",
    dataAiHint: "gift for her",
    gradientClasses: "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600",
    titleTextClass: "text-white",
    descriptionTextClass: "text-purple-100",
  },
  {
    id: 7,
    title: "Daily Deals",
    description: "Unbeatable prices on popular gifts, updated daily. Don't miss out!",
    imageUrl: "https://i.ibb.co/Jj8b0zQ/pexels-karolina-grabowska-5632345-1.jpg",
    dataAiHint: "gift sale discount",
    gradientClasses: "bg-gradient-to-l from-orange-400 via-amber-400 to-yellow-300",
    titleTextClass: "text-neutral-800",
    descriptionTextClass: "text-orange-900",
  },
  {
    id: 8,
    title: "New Arrivals",
    description: "Fresh designs and innovative gift ideas landing every week. Be the first to explore!",
    imageUrl: "https://i.ibb.co/4p5jD9Y/pexels-nothing-ahead-4067766-1.jpg",
    dataAiHint: "new product launch",
    gradientClasses: "bg-gradient-to-br from-rose-400 via-red-400 to-pink-400",
    titleTextClass: "text-white",
    descriptionTextClass: "text-pink-100",
  },
  {
    id: 9,
    title: "Artistic Touch",
    description: "Transform photos into unique art pieces. Personalized canvases, sketches, and more.",
    imageUrl: "https://i.ibb.co/d26pM6c/pexels-ann-h-1766938-1.jpg",
    dataAiHint: "photo to art canvas",
    gradientClasses: "bg-gradient-to-tr from-sky-300 via-blue-400 to-indigo-500",
    titleTextClass: "text-white",
    descriptionTextClass: "text-indigo-100",
  },
  {
    id: 10,
    title: "Miniature You!",
    description: "Get a custom 3D miniature of yourself or loved ones. A unique and memorable gift.",
    imageUrl: "https://i.ibb.co/BqTmnkR/pexels-antoni-shkraba-production-8040228-1.jpg",
    dataAiHint: "3d selfie miniature",
    gradientClasses: "bg-gradient-to-bl from-lime-300 via-green-400 to-teal-500",
    titleTextClass: "text-neutral-800",
    descriptionTextClass: "text-green-900",
  },
];

const HeroCarouselButton = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => (
  <Button
    asChild
    size="lg"
    className={cn(
      "shadow-lg transition-transform hover:scale-105 mt-4 sm:mt-6",
      "border-2 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary", 
      className
    )}
  >
    <Link href={href}>
      {children} <ArrowRightCircle className="ml-2 h-5 w-5" />
    </Link>
  </Button>
);


const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselBannersData.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  const bannerAnimationInactiveClasses = "opacity-0";
  const bannerAnimationActiveClasses = "opacity-100";
  const bannerBaseTransition = "transition-opacity duration-[2000ms] ease-in-out";

  const activeBanner = carouselBannersData[currentSlide];

  return (
    <section className="relative min-h-[350px] md:min-h-[450px] lg:min-h-[550px] w-full mb-8 sm:mb-12 rounded-lg overflow-hidden shadow-2xl">
      {/* Background Image Layers */}
      {carouselBannersData.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 w-full h-full",
            banner.gradientClasses,
            bannerBaseTransition,
            index === currentSlide ? bannerAnimationActiveClasses : bannerAnimationInactiveClasses + " pointer-events-none"
          )}
          style={{ zIndex: 1 }} 
        >
          <Image
            src={banner.imageUrl}
            alt="" 
            fill
            className="object-cover opacity-40 pointer-events-none" 
            data-ai-hint={banner.dataAiHint}
            priority={index === 0} 
          />
        </div>
      ))}

      {/* Static Content Area: Title, Description, and Button */}
      <div className="absolute inset-y-0 left-0 flex items-center p-6 sm:p-10 md:p-16 z-10 w-full md:w-3/5 lg:w-1/2">
        <div className="relative max-w-lg md:max-w-xl text-left"> 
          <h2 className={cn(
            "font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6",
            activeBanner.titleTextClass || "text-white",
            "transition-opacity duration-700 ease-out" 
          )}>
            {activeBanner.title}
          </h2>
          <p className={cn(
            "text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed",
            activeBanner.descriptionTextClass || "text-neutral-100",
             "transition-opacity duration-700 ease-out delay-100" 
          )}>
            {activeBanner.description}
          </p>
          <div className="transition-opacity duration-700 ease-out delay-200">
            <HeroCarouselButton href="/products">
              Explore More
            </HeroCarouselButton>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
        {carouselBannersData.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out transform",
              currentSlide === index ? "bg-primary scale-125 ring-2 ring-white/50 ring-offset-1 ring-offset-transparent" : "bg-white/60 hover:bg-white"
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
  { value: '0-499', label: 'Under ₹500' },
  { value: '500-999', label: '₹500 - ₹999' },
  { value: '1000-2999', label: '₹1000 - ₹2999' },
  { value: '3000-Infinity', label: 'Above ₹3000' },
];

const SmartFinderPanel = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedGiftType, setSelectedGiftType] = useState<string>('all');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('all');
  const [selectedPriceRangeKey, setSelectedPriceRangeKey] = useState<string>('all');

  const handleFindGifts = () => {
    const noFiltersSelected = 
      selectedOccasion === 'all' &&
      selectedGiftType === 'all' &&
      selectedRecipient === 'all' &&
      selectedPriceRangeKey === 'all';

    if (noFiltersSelected) {
      toast({
        title: "Select Filters",
        description: "Please select at least one filter to find gifts.",
        variant: "default", 
      });
      return; 
    }

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
  );
};

const TopCurations = () => {
  const curations = [
    { name: 'Birthdays', Icon: PartyPopper, slug:'birthday', type: 'occasion' },
    { name: 'Anniversaries', Icon: Gift, slug:'anniversary', type: 'occasion' },
    { name: 'Miniatures', Icon: ToyBrick, slug:'mini-you-series', type: 'giftType' },
    { name: 'Photo Frames', Icon: Camera, slug:'photo-frames', type: 'giftType' },
    { name: 'Corporate', Icon: Briefcase, slug:'corporate-awards', type: 'giftType' },
    { name: 'Personalized', Icon: SparklesIcon, slug:'photo-gifts-general', type: 'giftType' },
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
          );
        })}
      </div>
    </section>
  );
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
  const bannerImagesData = [
    { id: 1, imageUrl: "https://i.ibb.co/y06t0g7/pexels-august-de-richelieu-4261250-1.jpg", dataAiHint: "seasonal sale event" },
    { id: 2, imageUrl: "https://i.ibb.co/VxgkK4x/pexels-karolina-grabowska-4207783-1.jpg", dataAiHint: "new product showcase" },
    { id: 3, imageUrl: "https://i.ibb.co/9Y4jR7N/pexels-karolina-grabowska-4386466-1.jpg", dataAiHint: "gift ideas inspiration" },
    { id: 4, imageUrl: "https://i.ibb.co/C26zN1H/pexels-julia-m-cameron-4144923-1.jpg", dataAiHint: "special offer discount" },
    { id: 5, imageUrl: "https://i.ibb.co/QCS9kqc/pexels-karolina-grabowska-4207892-1.jpg", dataAiHint: "brand promotion" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImagesData.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, [bannerImagesData.length]);

  return (
    <section className="my-8 sm:my-12">
      <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg shadow-lg overflow-hidden">
        {bannerImagesData.map((banner, index) => (
          <Image
            key={banner.id}
            src={banner.imageUrl}
            alt={banner.dataAiHint || `Advertisement ${banner.id}`}
            fill
            className={cn(
              "object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            data-ai-hint={banner.dataAiHint}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const allTestimonialsData = [
    { id: 1, quote: "The personalized caricature was a huge hit! Amazing quality and super fast delivery.", author: "Priya S.", tag: "Loved It!", tagColor: "bg-green-500", rating: 5 },
    { id: 2, quote: "Ordered a 3D crystal for our anniversary, breathtaking and memorable.", author: "Amit K.", tag: "Perfect Gift!", tagColor: "bg-blue-500", rating: 5 },
    { id: 3, quote: "Customer service was fantastic in choosing the photo frame. Beautiful product.", author: "Rina M.", tag: "Great Service!", tagColor: "bg-yellow-500", rating: 4 },
    { id: 4, quote: "My team loved the custom mugs for our corporate event. Excellent branding.", author: "Vikram R., CEO", tag: "Recommend", tagColor: "bg-purple-500", rating: 5 },
    { id: 5, quote: "The miniature version of my pet was incredibly detailed. A truly special keepsake!", author: "Sneha P.", tag: "Adorable!", tagColor: "bg-pink-500", rating: 5 },
    { id: 6, quote: "Bulk farewell gifts were seamless, and everyone appreciated the customization.", author: "Rajesh G., HR", tag: "Efficient!", tagColor: "bg-teal-500", rating: 5 },
    { id: 7, quote: "Photo collage for my parents' anniversary was beautifully arranged. So touched.", author: "Anjali T.", tag: "Heartfelt", tagColor: "bg-orange-500", rating: 4 },
    { id: 8, quote: "Loved the 3D lamp with our family picture. Unique night light and conversation starter.", author: "Karan N.", tag: "Unique!", tagColor: "bg-cyan-500", rating: 5 },
    { id: 9, quote: "The engraved wooden plaque for my dad's retirement was top-notch. He loved it!", author: "Deepa V.", tag: "Classy!", tagColor: "bg-indigo-500", rating: 5 },
    { id: 10, quote: "Just4UGifts made our team awards so special with their crystal trophies. Great quality.", author: "Sunil M., Manager", tag: "Professional", tagColor: "bg-gray-700", rating: 5 },
    { id: 11, quote: "My custom bobblehead looked exactly like me! Hilarious and well-made.", author: "Rohan P.", tag: "So Fun!", tagColor: "bg-lime-500", rating: 4 },
    { id: 12, quote: "The photo-to-art canvas turned our vacation picture into a masterpiece. Highly recommend!", author: "Aisha B.", tag: "Artistic", tagColor: "bg-fuchsia-500", rating: 5 },
    { id: 13, quote: "Got a set of personalized keychains for my friends. They were a big hit, great quality.", author: "Varun S.", tag: "Great Value", tagColor: "bg-amber-500", rating: 5 },
    { id: 14, quote: "The nameplate for our new home is beautiful and exactly what we wanted. Thank you!", author: "Neha & Raj K.", tag: "Perfect Finish", tagColor: "bg-emerald-500", rating: 5 },
    { id: 15, quote: "Ordered a custom t-shirt with a quirky design. Print quality is excellent and fabric is comfy.", author: "Tina G.", tag: "Cool Stuff", tagColor: "bg-sky-500", rating: 4 },
    { id: 16, quote: "The shadow box for my collectibles is stunning. It showcases them perfectly. Superb craftsmanship.", author: "Arjun M.", tag: "Masterpiece", tagColor: "bg-rose-500", rating: 5 },
    { id: 17, quote: "Our wedding caricatures were a highlight! Everyone loved them as favors.", author: "Priya & Rahul", tag: "Wedding Hit!", tagColor: "bg-pink-600", rating: 5 },
    { id: 18, quote: "The 3D miniature of our family is a treasure. The details are incredible!", author: "The Sharma Family", tag: "Family Treasure", tagColor: "bg-blue-600", rating: 5 },
    { id: 19, quote: "My custom photo mug is my new favorite. Makes my coffee taste better!", author: "Aakash V.", tag: "Morning Joy", tagColor: "bg-orange-500", rating: 5 },
    { id: 20, quote: "The photo clock for my office is both functional and beautiful. Great conversation starter.", author: "Anita D.", tag: "Office Decor", tagColor: "bg-teal-600", rating: 4 },
    { id: 21, quote: "Just4UGifts has the best selection of unique gifts. I always find something perfect!", author: "Ravi K.", tag: "Go-To Store", tagColor: "bg-green-600", rating: 5 },
    { id: 22, quote: "The personalized photo keychain was a small gift but made a big impact. Loved it!", author: "Sara J.", tag: "Sweet & Simple", tagColor: "bg-purple-600", rating: 5 },
    { id: 23, quote: "My corporate clients were very impressed with the branded gift sets. Highly professional.", author: "Mr. Alok Verma", tag: "Corporate Choice", tagColor: "bg-indigo-600", rating: 5 },
    { id: 24, quote: "The photo-to-art canvas of my pet is stunning. It's like having a museum piece at home.", author: "Meera N.", tag: "Pet Portrait Love", tagColor: "bg-fuchsia-600", rating: 5 },
    { id: 25, quote: "I appreciate the quick turnaround for my last-minute gift. Saved the day!", author: "Kunal S.", tag: "Life Saver!", tagColor: "bg-red-600", rating: 5 },
    { id: 26, quote: "The quality of the 3D lamp exceeded my expectations. It's a magical gift.", author: "Preeti G.", tag: "Magical!", tagColor: "bg-cyan-600", rating: 5 },
    { id: 27, quote: "Finding the perfect birthday gift for my dad was easy here. He loved the wooden plaque.", author: "Aditi R.", tag: "Dad Approved", tagColor: "bg-amber-600", rating: 4 },
    { id: 28, quote: "The bobblehead of my boss for his farewell was a huge laugh and a great memento.", author: "Team Innovate", tag: "Fun Farewell", tagColor: "bg-lime-600", rating: 5 },
    { id: 29, quote: "I keep coming back for the unique personalized gifts. Always a hit with my friends and family.", author: "Sonia P.", tag: "Repeat Customer", tagColor: "bg-sky-600", rating: 5 },
    { id: 30, quote: "The customer support helped me finalize the design for my photo collage. Very helpful!", author: "Vikram C.", tag: "Helpful Support", tagColor: "bg-yellow-600", rating: 5 },
    { id: 31, quote: "Our anniversary photo frame is gorgeous. It’s a beautiful reminder of our special day.", author: "Rohan & Megha", tag: "Anniversary Love", tagColor: "bg-rose-600", rating: 5 },
    { id: 32, quote: "The welcome kits for our new employees were fantastic. Made a great first impression.", author: "HR, Tech Solutions", tag: "Great Onboarding", tagColor: "bg-emerald-600", rating: 5 },
    { id: 33, quote: "Ordered a caricature for my friend's wedding. It was unique and they adored it!", author: "Simran K.", tag: "Unique Wedding Gift", tagColor: "bg-green-500", rating: 5 },
    { id: 34, quote: "The 3D crystal of our first home is a cherished keepsake. So detailed!", author: "Arjun & Priya", tag: "Home Sweet Home", tagColor: "bg-blue-500", rating: 5 },
    { id: 35, quote: "My custom photo mug is perfect for my morning tea. Great print quality.", author: "Rajesh M.", tag: "Tea Time Favorite", tagColor: "bg-yellow-500", rating: 4 },
    { id: 36, quote: "The photo clock is a stylish addition to my office. Always get compliments on it.", author: "Nisha S.", tag: "Office Style", tagColor: "bg-purple-500", rating: 5 },
    { id: 37, quote: "Just4UGifts is my go-to for all special occasions. Never disappoints!", author: "Kavita L.", tag: "Reliable Gifting", tagColor: "bg-pink-500", rating: 5 },
    { id: 38, quote: "The personalized keychain was a small but meaningful gift for my sister. She loved it.", author: "Amit P.", tag: "Thoughtful Token", tagColor: "bg-teal-500", rating: 5 },
    { id: 39, quote: "Our corporate clients were thrilled with the elegant gift sets. Excellent service.", author: "Sunita G., Marketing Head", tag: "Client Impressed", tagColor: "bg-orange-500", rating: 5 },
    { id: 40, quote: "The photo-to-art canvas of our family vacation is a masterpiece. Beautiful work.", author: "The Desai Family", tag: "Vacation Memories", tagColor: "bg-cyan-500", rating: 5 },
    { id: 41, quote: "Needed a last-minute birthday gift and Just4UGifts delivered! Amazing service.", author: "Rohan J.", tag: "Speedy Delivery!", tagColor: "bg-indigo-500", rating: 5 },
    { id: 42, quote: "The 3D photo lamp is magical. It creates such a cozy atmosphere in our room.", author: "Pooja B.", tag: "Cozy Ambiance", tagColor: "bg-lime-500", rating: 5 },
    { id: 43, quote: "Finding a unique gift for my tech-savvy brother was easy here. He loved the gadget.", author: "Anjali M.", tag: "Tech Gift Win", tagColor: "bg-fuchsia-500", rating: 4 },
    { id: 44, quote: "The bobblehead of my favorite cricketer is hilarious and so well-made. A collector's item!", author: "Suresh K.", tag: "Fan Favorite", tagColor: "bg-amber-500", rating: 5 },
    { id: 45, quote: "I always recommend Just4UGifts for their creative and personalized options.", author: "Divya R.", tag: "Creative Choices", tagColor: "bg-emerald-500", rating: 5 },
    { id: 46, quote: "The customer support team was incredibly helpful in customizing my photo collage.", author: "Vikas S.", tag: "Great Assistance", tagColor: "bg-sky-500", rating: 5 },
    { id: 47, quote: "Our anniversary photo frame is a daily reminder of our love. Beautifully crafted.", author: "Karan & Tina", tag: "Love Frame", tagColor: "bg-rose-500", rating: 5 },
    { id: 48, quote: "The welcome kits for our new team members were a big success. Set a positive tone.", author: "HR Department, Alpha Corp", tag: "Positive Start", tagColor: "bg-green-600", rating: 5 },
    { id: 49, quote: "The custom caricature for my parents' 25th anniversary was the star of the party!", author: "Neha G.", tag: "Anniversary Star", tagColor: "bg-blue-600", rating: 5 },
    { id: 50, quote: "My 3D crystal paperweight is a stunning desk accessory. So elegant.", author: "Rajiv M.", tag: "Desk Elegance", tagColor: "bg-yellow-600", rating: 4 },
    { id: 51, quote: "The photo printed on a wooden plaque was a rustic and charming gift. Loved it.", author: "Sunita K.", tag: "Rustic Charm", tagColor: "bg-purple-600", rating: 5 },
    { id: 52, quote: "Gifted a custom bobblehead to my best friend, and he couldn't stop laughing. Perfect!", author: "Akash D.", tag: "Best Friend Gift", tagColor: "bg-pink-600", rating: 5 },
    { id: 53, quote: "The 3D lamp with our wedding photo is our favorite night light. So romantic.", author: "Priya & Sameer", tag: "Romantic Light", tagColor: "bg-teal-600", rating: 5 },
    { id: 54, quote: "Quick delivery and excellent quality on the personalized T-shirts for our event.", author: "Event Organizers Inc.", tag: "Event Success", tagColor: "bg-orange-600", rating: 5 },
    { id: 55, quote: "The engraved pen set was a sophisticated gift for my mentor. Highly appreciated.", author: "Rina S.", tag: "Sophisticated Choice", tagColor: "bg-cyan-600", rating: 5 },
    { id: 56, quote: "My photo-to-art canvas turned a simple phone picture into a work of art. Amazing!", author: "Vijay P.", tag: "Art from Photo", tagColor: "bg-indigo-600", rating: 5 },
    { id: 57, quote: "The personalized magnets are a fun way to display memories on the fridge.", author: "Lata M.", tag: "Fun Magnets", tagColor: "bg-lime-600", rating: 4 },
    { id: 58, quote: "The crystal trophy for our company's top performer was of exceptional quality.", author: "CEO, Innovate Ltd.", tag: "Top Performer Award", tagColor: "bg-fuchsia-600", rating: 5 },
    { id: 59, quote: "My daughter loves her custom nameplate for her room. So colorful and cute!", author: "Anil K.", tag: "Cute Nameplate", tagColor: "bg-amber-600", rating: 5 },
    { id: 60, quote: "The shadow box perfectly displays my son's first shoes. A precious memento.", author: "Geeta R.", tag: "Precious Memento", tagColor: "bg-emerald-600", rating: 5 },
    { id: 61, quote: "Just4UGifts helped me create a very special photo collage for my grandparents. They were overjoyed.", author: "Varun T.", tag: "Grandparents' Joy", tagColor: "bg-sky-600", rating: 5 },
    { id: 62, quote: "The custom coasters are a great addition to our coffee table. Very well made.", author: "Meena & Suresh", tag: "Coffee Table Decor", tagColor: "bg-rose-600", rating: 4 },
    { id: 63, quote: "I ordered a digital sketch for a friend who lives far away. It was a perfect and quick gift!", author: "Prakash S.", tag: "Perfect Digital Gift", tagColor: "bg-gray-700", rating: 5 },
    { id: 64, quote: "The team at Just4UGifts is always helpful and the products are top-notch. My trusted gift store.", author: "Anita B.", tag: "Trusted & Top-Notch", tagColor: "bg-red-500", rating: 5 },
  ];


  const ITEMS_PER_SET = 8;
  const ROTATION_INTERVAL = 15000; 

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allTestimonialsData.length <= ITEMS_PER_SET) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + ITEMS_PER_SET) % allTestimonialsData.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(intervalId);
  }, [allTestimonialsData.length]);

  const displayedTestimonials = useMemo(() => {
    const endIndex = currentIndex + ITEMS_PER_SET;
    if (endIndex > allTestimonialsData.length) {
        return allTestimonialsData.slice(currentIndex).concat(allTestimonialsData.slice(0, endIndex % allTestimonialsData.length));
    }
    return allTestimonialsData.slice(currentIndex, endIndex);
  }, [currentIndex, allTestimonialsData]);

  return (
    <section className="my-8 sm:my-12">
      <SectionTitle className="text-white mb-6 sm:mb-8">Words from Our Happy Gifting Community</SectionTitle>
      <div
        key={currentIndex}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {displayedTestimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="bg-neutral-800 border-neutral-700 shadow-lg flex flex-col hover:shadow-primary/30 transition-shadow duration-300 animate-in fade-in duration-500"
          >
            <CardContent className="p-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Quote className="w-6 h-6 text-primary opacity-50 transform -scale-x-100" />
                {testimonial.tag && (
                  <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white rounded-full ${testimonial.tagColor}`}>
                    {testimonial.tag}
                  </span>
                )}
              </div>
              <p className="text-neutral-300 italic text-xs sm:text-sm leading-normal mb-3 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-primary">{testimonial.author}</p>
                    {testimonial.rating && (
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIconLucide key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`} />
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
                  {OccIcon ? (
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
      text: "A truly thoughtful gift is a silent message of affection, a tangible reminder that someone holds you dear and took the time to express it beautifully.",
      animationClasses: "bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-[length:300%_300%] animate-nebula-shift",
      textColorClass: "text-white"
    },
    {
      id: 2,
      text: "The joy of gifting lies not in the object itself, but in the delight it brings to another's eyes, a shared moment of happiness that echoes long after the wrapping is gone.",
      animationClasses: "bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 bg-[length:200%_100%] animate-liquid-flow",
      textColorClass: "text-white"
    },
    {
      id: 3,
      text: "Gifts are more than mere possessions; they are bridges between hearts, tokens of appreciation, and symbols of the unspoken bonds that connect us.",
      animationClasses: "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-500 bg-[length:300%_300%] animate-bokeh-drift",
      textColorClass: "text-white"
    },
    {
      id: 4,
      text: "In every carefully chosen gift, there's a story whispered – a tale of understanding, remembrance, and the simple, profound desire to bring a smile to someone's face.",
      animationClasses: "bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-400 bg-[length:200%_100%] animate-subtle-stripes",
      textColorClass: "text-neutral-800" 
    },
    {
      id: 5,
      text: "Giving a gift is an art form where the heart guides the hand, selecting not just an item, but a piece of joy intended to brighten another's world.",
      animationClasses: "bg-gradient-to-br from-pink-400 via-rose-400 to-red-500 bg-[length:200%_200%] animate-watercolor-flow",
      textColorClass: "text-white"
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % quoteBanners.length);
    }, 10000); 

    return () => clearInterval(timer);
  }, [quoteBanners.length]);

  const currentBanner = quoteBanners[currentBannerIndex];

  return (
    <section className="my-8 sm:my-12">
      <div
        key={currentBanner.id} 
        className={cn(
          "w-full h-20 sm:h-24 md:h-28 flex items-center justify-center p-4 rounded-lg shadow-md relative overflow-hidden animate-breathing-scale",
          currentBanner.animationClasses,
          "transition-all duration-1000 ease-in-out" 
        )}
      >
        <p className={cn(
          "text-sm sm:text-base md:text-lg font-medium text-center italic relative z-10",
           currentBanner.textColorClass,
           "transition-opacity duration-500 ease-in-out"
           )}>
          "{currentBanner.text}"
        </p>
      </div>
    </section>
  );
};


const GiftTypeHighlight = () => {
    const featuredGiftTypes = GIFT_TYPES_LIST.filter(gt => [
        'mini-you-series',
        '3d-crystals',
        'photo-lamps',
        'photo-frames',
        'utility-mugs',
        'gift-hampers',
        'wooden-gifts',
        'spotify-gifts'
    ].includes(gt.slug));

    return (
    <section className="my-8 sm:my-12">
        <SectionTitle className="text-white">Featured Gift Types</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {featuredGiftTypes.map(giftType => {
                const IconComponent = giftType.Icon;
                return (
                    <Link
                        key={giftType.id}
                        href={`/products?category=${giftType.slug}`}
                        className="group block"
                    >
                        <Card className="bg-neutral-800 border-neutral-700 shadow-lg hover:shadow-primary/30 hover:border-primary/50 transition-all duration-300 ease-in-out group-hover:-translate-y-1 h-full flex flex-col">
                            <CardContent className="p-2 sm:p-3 flex flex-col items-center justify-center text-center flex-grow">
                                {IconComponent ? (
                                <IconComponent className="h-6 w-6 sm:h-7 text-primary mb-1 sm:mb-1.5 transition-transform duration-300 group-hover:scale-110" />
                                ) : giftType.dataAiHint && (
                                    <Image
                                        src={`https://placehold.co/40x40.png`} 
                                        alt={giftType.name}
                                        width={24} 
                                        height={24} 
                                        className="rounded-md object-cover mb-1 sm:mb-1.5 transition-transform duration-300 group-hover:scale-110"
                                        data-ai-hint={giftType.dataAiHint}
                                    />
                                )}
                                <h3 className="font-headline text-[10px] sm:text-[11px] text-neutral-200 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                    {giftType.name}
                                </h3>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    </section>
    );
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
                      src={`https://placehold.co/200x200.png`}
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
    

    







