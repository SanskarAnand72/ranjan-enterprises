'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Sparkles } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface CTASectionProps {
  content?: HomepageContent | null;
  settings: SiteSettings;
}

export default function CTASection({ content, settings }: CTASectionProps) {
  const title = content?.title || 'Commission Your Custom Wood Masterpiece';
  const subtitle = content?.subtitle || 'From Architectural Drawings to White-Glove Installation';
  const description = content?.description || 
    'Speak directly with our master joiner for custom dimensions, timber selection, and bespoke 3D CAD design renderings.';

  const waUrl = whatsappUrl(
    settings.whatsapp || settings.phone || '+918859123538',
    'Hello Ranjan Enterprises, I am ready to get a quote for a custom woodworking project.'
  );

  return (
    <section className="relative py-20 md:py-28 bg-wood-gradient overflow-hidden text-white noise">
      {/* Background Texture Graphic */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay noise" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-6">
        
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-tag bg-white/10 border-white/20 text-accent-light backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-light" />
          <span>BESPOKE CONSULTATION</span>
        </motion.div>

        {/* Subtitle */}
        <span className="font-display text-lg md:text-xl font-light text-amber-200/90 tracking-wide italic">
          {subtitle}
        </span>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-2xl tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-stone-300 font-light text-base md:text-lg max-w-xl leading-relaxed">
          {description}
        </p>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp py-3.5 px-8 text-xs uppercase tracking-wider font-semibold w-full sm:w-auto justify-center shadow-luxury-lg hover:shadow-glow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Consultation</span>
          </a>

          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 border-1.5 border-white/30 hover:border-white text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-white/10 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-accent-light" />
              <span>Call Workshop Master</span>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}

