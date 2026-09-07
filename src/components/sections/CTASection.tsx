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
  const title = content?.title || 'Ready to Create Your Dream Woodwork?';
  const subtitle = content?.subtitle || "Let's bring your vision to life";
  const description = content?.description || 
    "Contact us today for a free consultation. We'll work with you to design and create the perfect wooden Woodwork for your home or office.";

  const waUrl = whatsappUrl(
    settings.whatsapp || '',
    'Hello Ranjan Enterprises, I am ready to get a quote for a custom woodworking project.'
  );

  return (
    <section className="relative py-24 bg-wood-gradient overflow-hidden text-white">
      {/* Background Texture Graphic */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay noise" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-6">
        
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-accent-light" />
          <span className="font-display text-xs tracking-[0.2em] text-accent-light uppercase font-semibold">
            Bespoke Wood Creations
          </span>
        </motion.div>

        {/* Subtitle */}
        <span className="font-display text-lg md:text-xl font-light text-accent-light tracking-wide italic">
          {subtitle}
        </span>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          {title}
        </h2>

        {/* Description */}
        <p className="text-stone-250 font-light text-base md:text-lg max-w-xl leading-relaxed">
          {description}
        </p>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-stone-900 rounded-full font-semibold text-sm tracking-wide shadow-luxury-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4 text-green-500 fill-current" />
            <span>Consult via WhatsApp</span>
          </a>

          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-white/20 hover:border-white text-white rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-accent-light" />
              <span>Call Our Designer</span>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
