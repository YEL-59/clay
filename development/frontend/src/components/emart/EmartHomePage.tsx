import React from 'react';
import { EmartHero } from './EmartHero';
import { EmartValueProps } from './EmartValueProps';
import { EmartStripedShirtSection } from './EmartStripedShirtSection';
import { EmartElectronicsSection } from './EmartElectronicsSection';
import { EmartFashionSection } from './EmartFashionSection';
import { EmartFlashDealsSection } from './EmartFlashDealsSection';
import { EmartTestimonials } from './EmartTestimonials';

export const EmartHomePage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Category Menu & Banner Carousel */}
      <EmartHero />

      {/* 4 Colored Value Proposition Cards */}
      <EmartValueProps />

      {/* Signature Atelier Striped Shirt Collection (User Requested Section) */}
      <EmartStripedShirtSection />

      {/* Electronics & Gadgets Catalog Section */}
      <EmartElectronicsSection />

      {/* Editorial Fashion Section */}
      <EmartFashionSection />

      {/* Flash Deals with Live Countdown */}
      <EmartFlashDealsSection />

      {/* Verified Reviews & VIP Newsletter */}
      <EmartTestimonials />
    </div>
  );
};
