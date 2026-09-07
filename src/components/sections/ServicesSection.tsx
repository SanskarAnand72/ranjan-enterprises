'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { HomepageContent, Service } from '@/types';

interface ServicesSectionProps {
  content?: HomepageContent | null;
  services: Service[];
}

export default function ServicesSection({ content, services }: ServicesSectionProps) {
  const title = content?.title || 'Our Services';
  const subtitle = content?.subtitle || 'Comprehensive Woodworking Solutions';
  const description = content?.description || 'From custom Woodwork to interior woodwork, we offer a complete range of premium woodworking services.';

  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="section-subtitle">{subtitle}</span>
            <h2 className="section-title">{title}</h2>
            <p className="text-muted-foreground font-light text-base mt-2">
              {description}
            </p>
          </div>
          <Link
            href="/services"
            className="btn-outline shrink-0 justify-center hover-lift"
          >
            <span>All Services Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon || 'Hammer'] || Icons.Hammer;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative flex flex-col bg-background p-8 rounded-2xl border border-stone-200/55 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
              >
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground line-clamp-1">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Features List */}
                {service.features && service.features.length > 0 && (
                  <ul className="flex flex-col gap-2.5 mb-6 border-t border-stone-200/60 pt-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-stone-700">
                        <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold text-xs group-hover:text-primary-dark transition-colors duration-300 mt-auto"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
