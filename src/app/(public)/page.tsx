import React from 'react';
import { getFeaturedProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import { getHomepageContent, getSettings } from '@/actions/settings';
import { getFeaturedGallery } from '@/actions/gallery';
import { getServices } from '@/actions/services';
import { getTestimonials } from '@/actions/testimonials';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import ServicesSection from '@/components/sections/ServicesSection';
import GalleryPreview from '@/components/sections/GalleryPreview';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import ContactSection from '@/components/sections/ContactSection';
import type { Testimonial, Service } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Parallel fetch home page data
  const [
    featuredProducts,
    categories,
    homepageSections,
    settings,
    galleryAlbums,
    services,
    testimonials,
  ] = await Promise.all([
    getFeaturedProducts(),
    getCategories(true),
    getHomepageContent(),
    getSettings(),
    getFeaturedGallery(),
    getServices(true),
    getTestimonials(true),
  ]);

  // Map sections by key
  const sectionMap = homepageSections.reduce((acc, section) => {
    acc[section.section] = section;
    return acc;
  }, {} as Record<string, typeof homepageSections[0]>);

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <HeroSection 
        content={sectionMap['hero']} 
        settings={settings} 
      />

      {/* About Section */}
      <AboutSection 
        content={sectionMap['about']} 
      />

      {/* Featured Products */}
      <FeaturedProducts 
        products={featuredProducts} 
        categories={categories} 
      />

      {/* Why Choose Us */}
      <WhyChooseUs 
        content={sectionMap['why_choose_us']} 
      />

      {/* Services Section */}
      <ServicesSection 
        content={sectionMap['services_overview']} 
        services={services} 
      />

      {/* Gallery Preview */}
      <GalleryPreview 
        content={sectionMap['gallery_preview']} 
        albums={galleryAlbums} 
      />

      {/* Testimonials */}
      <TestimonialsSection 
        content={sectionMap['testimonials']} 
        testimonials={testimonials} 
      />

      {/* Call to Action */}
      <CTASection 
        content={sectionMap['cta']} 
        settings={settings}
      />

      {/* Contact Section */}
      <ContactSection 
        content={sectionMap['contact']} 
        settings={settings} 
      />
    </div>
  );
}
