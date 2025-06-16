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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <SectionTitle className="mb-0 text-left">Your Gift Registries</SectionTitle>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Registry
        </Button>
      </div>

      {registries.length > 0 ? (
        <div className="space-y-6">
          {registries.map(registry => (
            <div key={registry.id} className="p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="font-headline text-xl font-semibold text-primary">{registry.name}</h3>
                  <p className="text-sm text-muted-foreground">{registry.occasion} - {new Date(registry.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0 text-sm text-muted-foreground">
                  {registry.itemCount} items
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm">View Registry</Button>
                <Button variant="ghost" size="sm">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <ClipboardList className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground mb-2">No gift registries found.</p>
          <p className="text-muted-foreground mb-6">Create a registry for your special occasion and share it with friends and family.</p>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Registry
          </Button>
        </div>
      )}
    </div>
  );
}
