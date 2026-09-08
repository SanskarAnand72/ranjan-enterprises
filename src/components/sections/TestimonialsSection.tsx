'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import type { HomepageContent, Testimonial } from '@/types';

interface TestimonialsSectionProps {
  content?: HomepageContent | null;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ content, testimonials }: TestimonialsSectionProps) {
  const title = content?.title || 'Architect & Client Endorsements';
  const subtitle = content?.subtitle || 'Words from Private Homeowners & Interior Designers';
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[activeIndex];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-14">
          <div className="section-tag mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>CLIENT REVIEWS</span>
          </div>
          <span className="font-display text-base font-light text-primary tracking-widest uppercase italic">
            {subtitle}
          </span>
          <h2 className="section-title">{title}</h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mt-2" />
        </div>

        {/* Carousel Card Box */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-stone-50 border border-stone-200/80 shadow-luxury flex flex-col items-center justify-center">
          <Quote className="w-12 h-12 text-accent/30 mb-6" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < active.rating ? 'text-amber-500 fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              {/* Message Content */}
              <p className="font-serif text-lg sm:text-2xl font-medium italic text-stone-900 max-w-2xl leading-relaxed">
                "{active.content}"
              </p>

              {/* Author Row */}
              <div className="flex items-center gap-4 mt-2">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-wood-700/10 border border-amber-800/30 text-primary flex items-center justify-center font-bold text-sm">
                  {active.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.avatar_url}
                      alt={active.customer_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{getInitials(active.customer_name)}</span>
                  )}
                </div>

                <div className="text-left flex flex-col">
                  <span className="font-bold text-stone-950 text-sm tracking-wide">
                    {active.customer_name}
                  </span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                    {active.customer_location || 'Verified Homeowner'}
                    {active.product_purchased && ` • ${active.product_purchased}`}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-4 mt-10 w-full">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-stone-500 font-bold uppercase tracking-widest">
              {activeIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

