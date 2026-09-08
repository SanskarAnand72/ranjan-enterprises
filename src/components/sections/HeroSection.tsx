'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Sparkles, Award, ShieldCheck, Compass, Hammer } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface HeroSectionProps {
  content?: HomepageContent | null;
  settings: SiteSettings;
}

export default function HeroSection({ content, settings }: HeroSectionProps) {
  const title = content?.title || 'Crafting Legacy in Every Grain';
  const subtitle = content?.subtitle || 'Bespoke Joinery & Architectural Woodwork';
  const description = content?.description || 'Transforming raw Grade-A timber into heirloom architectural doors, bespoke carved mandirs, and luxury custom interiors.';
  
  // High-res luxury woodworking showroom background image
  const heroImage = (content?.content_json?.hero_image_url as string) || 
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop';

  const waUrl = whatsappUrl(
    settings.whatsapp || settings.phone || '+918859123538',
    `Hello Ranjan Enterprises, I would like to consult on custom wooden works and architectural joinery.`
  );

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-28 pb-12">
      {/* Background Image with Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="Master Woodworking Showroom"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/50 to-stone-950" />
        <div className="absolute inset-0 noise" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
        >
          {/* Craft Tag */}
          <div className="section-tag bg-stone-900/80 border-amber-500/20 text-accent backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>EST. 15+ YEARS • MASTER JOINERY WORKSHOP</span>
          </div>

          {/* Subtitle */}
          <span className="font-display text-lg sm:text-xl md:text-2xl font-light text-amber-200/90 tracking-[0.12em] italic">
            {subtitle}
          </span>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-stone-300 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/products"
              className="btn-primary w-full sm:w-auto justify-center shadow-lg hover:shadow-glow"
            >
              <span>Explore Master Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto justify-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct Quote</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Trust & Craftsmanship Highlights Strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-stone-900/70 backdrop-blur-md border border-stone-800/80 text-stone-200">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-accent flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Solid Teak Timber</span>
              <span className="text-[11px] text-stone-400">Kiln-Dried & Termite-Proof</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-accent flex-shrink-0">
              <Hammer className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Hand-Carved Joinery</span>
              <span className="text-[11px] text-stone-400">Mortise & Tenon Precision</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-accent flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Bespoke 3D CAD</span>
              <span className="text-[11px] text-stone-400">Custom Dimensions & Drawings</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/30 flex items-center justify-center text-accent flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Quality Assurance</span>
              <span className="text-[11px] text-stone-400">Lifetime Warranty</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

