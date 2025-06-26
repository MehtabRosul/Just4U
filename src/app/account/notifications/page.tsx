import React from 'react';
import { SectionTitle } from '@/components/shared/SectionTitle';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-6">Notifications</SectionTitle>
      <div className="text-center text-muted-foreground">
        <p>Check back here for more & latest notifications and updates.</p>
      </div>
    </div>
  );
}