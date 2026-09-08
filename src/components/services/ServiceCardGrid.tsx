'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  DoorClosed, 
  ShieldCheck, 
  Grid, 
  Box, 
  Layers, 
  Sparkles, 
  Hammer, 
  Wrench, 
  Cpu, 
  Building2, 
  ArrowRight, 
  MessageSquare,
  Check
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Service } from '@/types';

interface ServiceCardGridProps {
  services: Service[];
}

// Icon mapping helper
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Hammer;
  const map: Record<string, React.ElementType> = {
    DoorClosed,
    ShieldCheck,
    Grid,
    Box,
    Layers,
    Sparkles,
    Hammer,
    Wrench,
    Cpu,
    Building2,
  };
  if (map[iconName]) return map[iconName];
  return (Icons as any)[iconName] || Hammer;
};

export default function ServiceCardGrid({ services }: ServiceCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const IconComponent = getIconComponent(service.icon);

        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group flex flex-col bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-luxury-hover hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle top accent bar on hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-900/5 border border-amber-800/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm">
                <IconComponent className="w-6 h-6" />
              </div>

              <span className="text-xs font-serif font-bold text-stone-600/70 group-hover:text-amber-800 transition-colors">
                0{index + 1}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-primary transition-colors duration-300 mb-3 leading-snug">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6 flex-grow">
              {service.description}
            </p>

            {/* Feature Checkmarks if available */}
            {service.features && service.features.length > 0 && (
              <ul className="flex flex-col gap-2 mb-6 border-t border-stone-100 pt-4">
                {service.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Action Footer */}
            <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/919412165099?text=${encodeURIComponent(`Hello Ranjan Enterprises, I am interested in your service: "${service.title}". Please provide details and a custom quote.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-3.5 py-2 text-xs"
                title="Request direct quotation on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Request Quote</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-primary transition-colors group-hover:translate-x-0.5 duration-300"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
