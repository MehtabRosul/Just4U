
"use client";

import { useState, useEffect } from 'react';
import type { Product, Occasion, GiftType, Recipient } from '@/lib/types';
import { PRODUCTS, OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Sparkles as SparklesIcon, Quote, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

  // Banner fade transition classes
  const bannerAnimationInactiveClasses = "opacity-0";
  const bannerAnimationActiveClasses = "opacity-100";
  const bannerBaseTransition = "transition-opacity duration-[1500ms] ease-in-out";

  // Text animation classes (pure fade)
  const commonTextInactiveAnimation = "opacity-0";
  const commonTextActiveAnimation = "opacity-100";
  
  // Base transition classes for text elements (sequential fade, slightly different timing)
  const iconBaseTransition = "transition-opacity duration-[1000ms] ease-out delay-[200ms]";
  const titleBaseTransition = "transition-opacity duration-[1000ms] ease-out delay-[350ms]";
  const descriptionBaseTransition = "transition-opacity duration-[1000ms] ease-out delay-[500ms]";
  const buttonBaseTransition = "transition-opacity duration-[1000ms] ease-out delay-[650ms]";


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
       {/* Navigation Dots */}
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
                                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`} />
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
      <TestimonialsSection />
    </div>
  );
}
    

    

    




    

    

    

    

