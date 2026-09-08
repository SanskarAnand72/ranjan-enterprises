'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { HomepageContent } from '@/types';

interface WhyChooseUsProps {
  content?: HomepageContent | null;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export default function WhyChooseUs({ content }: WhyChooseUsProps) {
  const title = content?.title || 'Pillars of Artisanal Mastery';
  const subtitle = content?.subtitle || 'Why Discerning Clients Choose Ranjan Enterprises';

  const defaultItems: FeatureItem[] = [
    {
      icon: 'Award',
      title: 'Hand-Selected Grade-A Timber',
      description: 'We source seasoned Teak, Rosewood, Sheesham, and Mango wood with perfect grain density, individually inspected before carving.',
    },
    {
      icon: 'Hammer',
      title: 'Traditional Mortise & Tenon Joinery',
      description: 'Structural integrity built without weak shortcuts. Every door, frame, and joint is engineered to withstand decades of heavy use.',
    },
    {
      icon: 'Palette',
      title: 'Custom 3D CAD & Hand Carving',
      description: 'Detailed architectural drawings paired with heritage hand-carving techniques tailored precisely to your interior dimensions.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Kiln-Seasoned Termite Protection',
      description: '100% kiln-dried timber treated with organic preservatives to prevent warping, moisture damage, and wood bore attack.',
    },
    {
      icon: 'Sparkles',
      title: 'Natural Oil & Organic Wax Polish',
      description: 'Hand-rubbed finishes that accentuate natural wood grain depth, providing a soft satin sheen without synthetic plastic coats.',
    },
    {
      icon: 'HeartHandshake',
      title: 'White-Glove Fitting & Installation',
      description: 'Our master craftsmen handle on-site measurements, transport, alignment, and final installation with total precision.',
    },
  ];

  const items: FeatureItem[] = (content?.content_json?.items as FeatureItem[]) || defaultItems;

  return (
    <section className="py-20 md:py-28 bg-stone-900 text-stone-100 noise relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <div className="section-tag bg-stone-800/90 border-amber-600/30 text-amber-200">
            <Icons.Shield className="w-3.5 h-3.5 text-accent" />
            <span>UNCOMPROMISING STANDARDS</span>
          </div>
          <span className="font-display text-base font-light text-amber-200/90 tracking-widest uppercase italic">
            {subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mt-2" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.Award;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="group p-8 bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-amber-700/50 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/40 text-accent flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

