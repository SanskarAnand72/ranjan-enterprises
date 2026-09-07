'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye, Grid } from 'lucide-react';
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
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    const images = filteredAlbums[activeAlbumIdx]?.images || [];
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentAlbum = filteredAlbums[activeAlbumIdx];
  const currentImage = currentAlbum?.images?.[activeImageIdx];

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10 text-center">
          <span className="section-subtitle">Workshop Showroom</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Our Completed Projects
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-light text-sm mt-1">
            Explore our visual archive of custom wooden works, designed and hand-built for Pooja Rooms, Main Entrances, Interior Woodworks, offices, and entries.
          </p>
        </div>

        {/* Category Filters row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-300 ${
              !selectedCategory
                ? 'bg-primary text-white shadow-md'
                : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
            }`}
          >
            All Projects
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of albums/projects */}
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-250 shadow-luxury">
            <p className="text-stone-500 font-serif text-lg">No gallery projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album, albumIdx) => {
              const images = album.images || [];
              const coverImg = album.cover_image_url || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop';

              return (
                <div
                  key={album.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury border border-stone-200/50"
                >
                  {/* Cover block */}
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImg}
                      alt={album.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => openLightbox(albumIdx, 0)}
                        className="w-12 h-12 bg-white/90 text-stone-950 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
                        aria-label="Open project photos"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {album.category && (
                      <span className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-stone-900/85 text-white">
                        {album.category}
                      </span>
                    )}

                    {images.length > 1 && (
                      <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-white text-stone-800 shadow-sm border border-stone-200">
                        <Grid className="w-3 h-3 text-accent" />
                        <span>{images.length} Photos</span>
                      </span>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 mb-1.5">
                      {album.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {album.description || 'Custom bespoke crafted project for client showroom.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Overlay Viewer */}
      <AnimatePresence>
        {lightboxOpen && currentAlbum && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Top Toolbar */}
            <div className="p-6 flex items-center justify-between text-white border-b border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                  {currentAlbum.category || 'Project'}
                </span>
                <span className="font-serif text-lg font-bold">
                  {currentAlbum.title}
                </span>
              </div>

              <button
                onClick={closeLightbox}
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
                aria-label="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider frame */}
            <div className="flex-grow flex items-center justify-between px-4 sm:px-8 relative">
              {/* Prev button */}
              {(currentAlbum.images?.length || 0) > 1 && (
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-300 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Main Image content */}
              <div className="max-w-4xl max-h-[70vh] aspect-square md:aspect-[4/3] relative mx-auto flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.url}
                  alt={currentImage.alt_text || currentAlbum.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5"
                />
              </div>

              {/* Next button */}
              {(currentAlbum.images?.length || 0) > 1 && (
                <button
                  onClick={handleNext}
                  className="w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-300 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Details panel */}
            <div className="p-6 text-center text-stone-400 border-t border-white/5 text-xs font-semibold uppercase tracking-widest bg-stone-900/20">
              {(currentAlbum.images?.length || 0) > 1 && (
                <span>
                  Photo {activeImageIdx + 1} of {currentAlbum.images?.length}
                </span>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
