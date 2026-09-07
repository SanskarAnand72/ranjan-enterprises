'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
  const title = content?.title || 'About Ranjan Enterprises';
  const subtitle = content?.subtitle || '15+ Years of Master Craftsmanship';
  const description = content?.description || 
    'We are passionate woodworkers dedicated to creating timeless pieces that blend traditional techniques with contemporary aesthetics. Every product we create is a testament to our commitment to quality and artistry.';

  // Retrieve stats from JSON content or default them
  const defaultStats: StatItem[] = [
    { value: '500+', label: 'Projects Completed' },
    { value: '15+', label: 'Years Experience' },
    { value: '50+', label: 'Happy Clients' },
    { value: '100%', label: 'Custom Made' },
  ];

  const stats: StatItem[] = (content?.content_json?.stats as StatItem[]) || defaultStats;
  
  const defaultAboutImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop';
  const aboutImage = (content?.content_json?.about_image_url as string) || defaultAboutImage;

  return (
    <section className="py-24 bg-cream-gradient relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Image collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-luxury-lg z-10 border border-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aboutImage}
                alt="Woodworking Artisans"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Visual background accents */}
            <div className="absolute -bottom-8 -right-8 w-72 h-48 bg-accent/10 rounded-2xl -z-0 blur-lg" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl -z-0" />
          </motion.div>

          {/* Right Column: Text content & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="section-subtitle">{subtitle}</span>
              <h2 className="section-title">{title}</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base font-light">
              {description}
            </p>

            <p className="text-stone-700 leading-relaxed text-sm font-medium">
              We select each plank of teak, rosewood, and mango wood individually. Every cut, joint, and polishing stage is handled by seasoned woodworkers.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border border-stone-200/60 shadow-luxury">
                  <span className="block font-serif text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm group hover:text-primary-dark transition-colors duration-300"
              >
                <span>Read Our Heritage Story</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
