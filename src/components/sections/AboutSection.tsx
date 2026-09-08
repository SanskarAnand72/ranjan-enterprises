'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Shield, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { HomepageContent } from '@/types';

interface AboutSectionProps {
  content?: HomepageContent | null;
}

interface StatItem {
  value: string;
  label: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const title = content?.title || 'Mastery In Wood & Heritage';
  const subtitle = content?.subtitle || '15+ Years of Dedicated Craftsmanship';
  const description = content?.description || 
    'We are master woodworkers committed to shaping solid timber into timeless architectural doors, carved mandirs, and luxury residential furniture that endures for generations.';

  const defaultStats: StatItem[] = [
    { value: '500+', label: 'Custom Joinery Projects' },
    { value: '15+', label: 'Years Master Workshop' },
    { value: '100%', label: 'Solid Seasoned Timber' },
    { value: 'Lifetime', label: 'Craft Guarantee' },
  ];

  const stats: StatItem[] = (content?.content_json?.stats as StatItem[]) || defaultStats;
  
  const defaultAboutImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop';
  const aboutImage = (content?.content_json?.about_image_url as string) || defaultAboutImage;

  return (
    <section className="py-20 md:py-28 bg-cream-gradient relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Workshop Artisan Image Showcase (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-luxury-lg z-10 border border-stone-200/80 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aboutImage}
                alt="Woodworking Artisan at Work"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60" />
              
              {/* Image Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-dark border border-amber-800/30 flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent flex-shrink-0" />
                <div className="flex flex-col text-white">
                  <span className="text-xs font-bold uppercase tracking-wider">Hand-Polished Finish</span>
                  <span className="text-[11px] text-stone-300">Natural Oils & Organic Wood Wax</span>
                </div>
              </div>
            </div>
            
            {/* Visual background accents */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent/10 rounded-full blur-2xl -z-0" />
          </motion.div>

          {/* Right Column: Narrative & Stats (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="section-subtitle">{subtitle}</span>
              <h2 className="section-title">{title}</h2>
            </div>

            <p className="text-stone-700 leading-relaxed text-base font-light">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              {[
                'Hand-Selected Teak, Rosewood & Sheesham',
                'Precision Mortise & Tenon Structural Joinery',
                'Custom Architectural Door Carving',
                'Kiln-Seasoned Timber (Termite Proof)',
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-luxury flex flex-col justify-center">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-0.5">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <Link
                href="/about"
                className="btn-outline text-xs uppercase tracking-wider hover-lift"
              >
                <span>Discover Workshop Heritage</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

