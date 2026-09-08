'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye, Grid, MessageSquare, Award } from 'lucide-react';
import type { Gallery } from '@/types';

interface GalleryClientProps {
  albums: Gallery[];
}

export default function GalleryClient({ albums }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Lightbox index states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeAlbumIdx, setActiveAlbumIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Extract all unique categories
  const categories = Array.from(
    new Set(albums.map((album) => album.category).filter(Boolean))
  ) as string[];

  // Filtered albums
  const filteredAlbums = selectedCategory
    ? albums.filter((a) => a.category === selectedCategory)
    : albums;

  const openLightbox = (albumIdx: number, imgIdx: number) => {
    setActiveAlbumIdx(albumIdx);
    setActiveImageIdx(imgIdx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handlePrev = () => {
    const images = filteredAlbums[activeAlbumIdx]?.images || [];
    if (images.length === 0) return;
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    const images = filteredAlbums[activeAlbumIdx]?.images || [];
    if (images.length === 0) return;
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentAlbum = filteredAlbums[activeAlbumIdx];
  const currentImage = currentAlbum?.images?.[activeImageIdx];

  const handleWhatsAppInquiry = (albumTitle: string) => {
    const message = `Hello Ranjan Enterprises, I am interested in getting a custom project built similar to your gallery project: "${albumTitle}". Could you please provide details and a cost estimate?`;
    window.open(`https://wa.me/919412165099?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <span className="section-subtitle">Visual Craft Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mt-1">
            Our Architectural Archive
          </h1>
          <div className="divider-gold mx-auto my-4" />
          <p className="text-muted-foreground font-light text-base leading-relaxed">
            Explore a curated selection of handcrafted Pooja Rooms, carved solid teak entrances, custom dining tables, and bespoke interior paneling commissioned by discerning homeowners.
          </p>
        </div>

        {/* Category Filters row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs font-semibold tracking-wider uppercase py-2.5 px-6 rounded-full transition-all duration-300 ${
              !selectedCategory
                ? 'bg-primary text-white shadow-md'
                : 'bg-white hover:bg-stone-100/80 border border-stone-200 text-stone-700'
            }`}
          >
            All Projects ({albums.length})
          </button>

          {categories.map((cat) => {
            const count = albums.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold tracking-wider uppercase py-2.5 px-6 rounded-full transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white hover:bg-stone-100/80 border border-stone-200 text-stone-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid of albums/projects */}
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200/60 shadow-luxury">
            <p className="text-stone-500 font-serif text-xl">No architectural projects found under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album, albumIdx) => {
              const images = album.images || [];
              const coverImg = album.cover_image_url || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop';

              return (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: albumIdx * 0.05 }}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-luxury hover:shadow-luxury-hover transition-all duration-500"
                >
                  {/* Cover image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImg}
                      alt={album.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => openLightbox(albumIdx, 0)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 text-stone-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg hover:bg-white transition-all duration-300 transform group-hover:scale-105"
                        aria-label="Inspect project photos"
                      >
                        <Eye className="w-4 h-4 text-primary" />
                        <span>Inspect Gallery</span>
                      </button>
                    </div>

                    {album.category && (
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-stone-900/80 backdrop-blur-md text-stone-200 border border-white/10">
                        {album.category}
                      </span>
                    )}

                    {images.length > 1 && (
                      <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-white/90 backdrop-blur-md text-stone-800 shadow-sm border border-stone-200">
                        <Grid className="w-3 h-3 text-accent" />
                        <span>{images.length} Photos</span>
                      </span>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {album.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-light mb-4">
                      {album.description || 'Custom crafted architectural joinery designed and installed with precision seasoned timber.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400 font-serif italic flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        Handcrafted Atelier
                      </span>
                      <button
                        onClick={() => openLightbox(albumIdx, 0)}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        View Project &rarr;
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Overlay Viewer */}
      <AnimatePresence>
        {lightboxOpen && currentAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Top Toolbar */}
            <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                  {currentAlbum.category || 'Architectural Project'}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {currentAlbum.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleWhatsAppInquiry(currentAlbum.title)}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Inquire This Design
                </button>
                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
                  aria-label="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slider frame */}
            <div className="flex-grow flex items-center justify-between px-4 sm:px-8 relative py-4">
              {/* Prev button */}
              {(currentAlbum.images?.length || 0) > 1 && (
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Main Image content */}
              <div className="max-w-4xl max-h-[65vh] relative mx-auto flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage?.url || currentAlbum.cover_image_url || ''}
                  alt={currentImage?.alt_text || currentAlbum.title}
                  className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Next button */}
              {(currentAlbum.images?.length || 0) > 1 && (
                <button
                  onClick={handleNext}
                  className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip & Counter */}
            <div className="p-6 flex flex-col items-center gap-4 border-t border-white/10 bg-stone-900/40 backdrop-blur-md">
              {(currentAlbum.images?.length || 0) > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-1 px-4">
                  {currentAlbum.images?.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIdx === idx
                          ? 'border-accent scale-105 shadow-md'
                          : 'border-white/20 opacity-50 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between w-full max-w-xl text-stone-400 text-xs tracking-wider uppercase font-medium">
                <span>
                  Photo {activeImageIdx + 1} of {currentAlbum.images?.length || 1}
                </span>
                <button
                  onClick={() => handleWhatsAppInquiry(currentAlbum.title)}
                  className="sm:hidden text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Inquire
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
