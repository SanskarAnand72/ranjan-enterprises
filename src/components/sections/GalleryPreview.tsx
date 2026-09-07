'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import type { HomepageContent, Gallery } from '@/types';

interface GalleryPreviewProps {
  content?: HomepageContent | null;
  albums: Gallery[];
}

export default function GalleryPreview({ content, albums }: GalleryPreviewProps) {
  const title = content?.title || 'Our Work';
  const subtitle = content?.subtitle || 'A Portfolio of Excellence';
  const description = content?.description || 'Browse through our completed projects and see the quality of craftsmanship we bring to every piece.';

  if (!albums || albums.length === 0) return null;

  return (
    <section className="py-24 bg-cream-gradient relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="section-subtitle">{subtitle}</span>
            <h2 className="section-title">{title}</h2>
            <p className="text-muted-foreground font-light text-sm mt-1">
              {description}
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm group hover:text-primary-dark transition-colors duration-300"
          >
            <span>View Full Gallery Archive</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-luxury border border-stone-200/50 bg-stone-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Visual Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {album.category && (
                    <span className="text-[9px] font-bold tracking-widest uppercase text-accent mb-1">
                      {album.category}
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold mb-3 text-white">
                    {album.title}
                  </h3>
                  
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span>View Album Projects</span>
                    <Eye className="w-3.5 h-3.5" />
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
