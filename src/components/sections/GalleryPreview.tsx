'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import type { HomepageContent, Gallery } from '@/types';

interface GalleryPreviewProps {
  content?: HomepageContent | null;
  albums: Gallery[];
}

export default function GalleryPreview({ content, albums }: GalleryPreviewProps) {
  const title = content?.title || 'Architectural Joinery Showcase';
  const subtitle = content?.subtitle || 'Selected Works & Finished Installs';
  const description = content?.description || 'Explore our custom installations, bespoke solid wood doors, and carved mandirs crafted for private residences.';

  if (!albums || albums.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-cream-gradient relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200/60 pb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="section-tag w-fit mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>PROJECT PORTFOLIO</span>
            </div>
            <h2 className="section-title">{title}</h2>
            <p className="text-stone-600 font-light text-sm mt-1">
              {description}
            </p>
          </div>
          <Link
            href="/gallery"
            className="btn-outline text-xs uppercase tracking-wider hover-lift self-start md:self-auto"
          >
            <span>Explore Full Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => {
            const fallbackImage = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop';
            const imageUrl = album.cover_image_url || fallbackImage;

            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury border border-stone-200/80 bg-stone-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                
                {/* Visual Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-white transition-transform duration-300">
                  {album.category && (
                    <span className="text-[9px] font-bold tracking-widest uppercase text-accent mb-1">
                      {album.category}
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold mb-2 text-white group-hover:text-amber-200 transition-colors">
                    {album.title}
                  </h3>
                  
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span>View Project</span>
                    <Camera className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

