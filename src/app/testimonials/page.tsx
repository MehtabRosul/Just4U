
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/shared/StarRating';
import { Quote } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react'; // Added for potential future dynamic loading

// Re-using a subset of testimonials from homepage data for consistency
// In a real app, this might fetch dedicated testimonials for this page
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
];


export default function TestimonialsPage() {
  // For now, display all testimonials statically. Could add pagination later.
  const displayedTestimonials = allTestimonialsData;

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-8 sm:mb-10 text-center">What Our Customers Say</SectionTitle>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedTestimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="bg-card border-border shadow-lg flex flex-col hover:shadow-primary/30 transition-shadow duration-300"
          >
            <CardContent className="p-4 sm:p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2.5">
                <Quote className="w-7 h-7 text-primary opacity-60 transform -scale-x-100" />
                {testimonial.tag && (
                  <span className={`px-2.5 py-1 text-xs font-semibold text-white rounded-full ${testimonial.tagColor}`}>
                    {testimonial.tag}
                  </span>
                )}
              </div>
              <p className="text-card-foreground italic text-sm leading-relaxed mb-3.5 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">{testimonial.author}</p>
                    {testimonial.rating && (
                        <StarRating rating={testimonial.rating} starSize="h-4 w-4" />
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {/* Future: Add pagination or load more if many testimonials */}
    </div>
  );
}

    