
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { ClipboardList, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data structure for registries for now
interface MockRegistry {
  id: string;
  name: string;
  occasion: string;
  date: string;
  itemCount: number;
}

const mockRegistries: MockRegistry[] = [
  { id: 'reg1', name: "Sarah & John's Wedding", occasion: 'Wedding', date: '2024-09-15', itemCount: 25 },
  { id: 'reg2', name: "Baby Miller's Shower", occasion: 'Baby Shower', date: '2024-07-20', itemCount: 18 },
];


export default function RegistriesPage() {
  // In a real app, this would use a custom hook like useGiftRegistry
  const registries = mockRegistries; // Using mock data

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <SectionTitle className="mb-0 text-center sm:text-left">Your Gift Registries</SectionTitle>
        <Button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Registry
        </Button>
      </div>

      {registries.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {registries.map(registry => (
            <div key={registry.id} className="p-4 sm:p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0 flex-grow">
                  <h3 className="font-headline text-md sm:text-lg font-semibold text-primary">{registry.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{registry.occasion} - {new Date(registry.date).toLocaleDateString()}</p>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-4 shrink-0">
                  {registry.itemCount} items
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">View Registry</Button>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 sm:py-16 border border-dashed rounded-lg mt-4 sm:mt-0">
          <ClipboardList className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">No gift registries found.</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">Create a registry for your special occasion and share it with friends and family.</p>
          <Button size="lg" className="px-6 py-3">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Registry
          </Button>
        </div>
      )}
    </div>
  );
}
