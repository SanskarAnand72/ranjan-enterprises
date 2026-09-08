'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { HomepageContent, Service } from '@/types';
import ServiceCardGrid from '@/components/services/ServiceCardGrid';

interface ServicesSectionProps {
  content?: HomepageContent | null;
  services: Service[];
}

export default function ServicesSection({ content, services }: ServicesSectionProps) {
  const title = content?.title || 'Our Craftsmanship Services';
  const description = content?.description || 'From custom entrances and luxury interiors to handcrafted furniture and restoration work, we deliver bespoke woodworking solutions tailored to every space.';

  if (!services || services.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background relative border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-stone-200/70 pb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="section-tag w-fit mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>ATELIER SCOPE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight">
              {title}
            </h2>
            <p className="text-stone-600 font-light text-base mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <Link
            href="/services"
            className="btn-outline text-xs uppercase tracking-wider shrink-0 justify-center hover-lift"
          >
            <span>Explore All 10 Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Column Service Card Grid (Icon-Focused, No Images) */}
        <ServiceCardGrid services={services} />

      </div>
    </section>
  );
}



