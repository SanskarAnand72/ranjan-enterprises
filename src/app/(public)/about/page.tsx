import React from 'react';
import type { Metadata } from 'next';
import { getHomepageSection, getSettings } from '@/actions/settings';
import AboutPageClient from '@/components/about/AboutPageClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Heritage Story & Woodworking Atelier',
  description: 'Discover the craftsmanship heritage of Ranjan Enterprises — master woodworkers specializing in architectural wooden doors, carved gates, wardrobes, and luxury bespoke furniture.',
};

export default async function AboutPage() {
  const [content, settings] = await Promise.all([
    getHomepageSection('about'),
    getSettings(),
  ]);

  return (
    <AboutPageClient 
      content={content} 
      settings={settings} 
    />
  );
}
