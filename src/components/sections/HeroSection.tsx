'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface HeroSectionProps {
  content?: HomepageContent | null;
  settings: SiteSettings;
}

export default function HeroSection({ content, settings }: HeroSectionProps) {
  const title = content?.title || 'Crafting Excellence in Every Grain';
  const subtitle = content?.subtitle || 'Premium Wooden Works & Custom Woodwork';
  const description = content?.description || 'Experience the finest handcrafted wooden Woodwork and bespoke woodworking solutions tailored to your vision.';
  
  // Custom hero image or default premium showroom wood texture
  const heroImage = (content?.content_json?.hero_image_url as string) || 
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1920&auto=format&fit=crop';

  const waUrl = whatsappUrl(
    settings.whatsapp || '',
    `Hello Ranjan Enterprises, I am interested in custom wooden works.`
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
      {/* Background Image with Dark Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Premium Woodworking Showroom"
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.35)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/60 to-background" />
        <div className="absolute inset-0 noise" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-display text-sm tracking-[0.15em] text-accent uppercase font-medium">
              Bespoke Wood Workshop
            </span>
          </div>

          {/* Subtitle */}
          <h2 className="font-display text-lg md:text-2xl font-light text-accent tracking-[0.1em] italic">
            {subtitle}
          </h2>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white max-w-4xl leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-stone-300 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
            <Link
              href="/products"
              className="btn-primary w-full sm:w-auto justify-center hover-lift"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-stone-950 w-full sm:w-auto justify-center hover-lift"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Elegant Bottom Border Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll to Discover</span>
        <div className="w-5 h-8 border border-stone-600 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-accent rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
