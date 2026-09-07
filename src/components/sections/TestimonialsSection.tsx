'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import type { HomepageContent, Testimonial } from '@/types';

interface TestimonialsSectionProps {
  content?: HomepageContent | null;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ content, testimonials }: TestimonialsSectionProps) {
  const title = content?.title || 'Client Testimonials';
  const subtitle = content?.subtitle || 'What Our Customers Say';
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Header */}
        <div className="flex flex-col gap-3 mb-16">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-2" />
        </div>

        {/* Carousel Window */}
        <div className="relative min-h-[300px] flex flex-col items-center justify-center">
          <Quote className="w-16 h-16 text-accent/15 mb-6 animate-pulse" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < active.rating ? 'text-amber-400 fill-current' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Message Content */}
              <p className="font-serif text-lg md:text-2xl font-medium italic text-stone-850 max-w-2xl leading-relaxed">
                "{active.content}"
              </p>

              {/* Author Row */}
              <div className="flex items-center gap-4 mt-4">
                {/* Avatar with fallback initials */}
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
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
                  <span className="font-bold text-foreground text-sm tracking-wide">
                    {active.customer_name}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {active.customer_location || 'Customer'}
                    {active.product_purchased && ` • Bought ${active.product_purchased}`}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-4 mt-12 w-full">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-stone-200 hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
              {activeIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-stone-200 hover:border-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors duration-300"
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
