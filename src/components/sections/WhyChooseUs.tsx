'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { HomepageContent } from '@/types';

interface WhyChooseUsProps {
  content?: HomepageContent | null;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export default function WhyChooseUs({ content }: WhyChooseUsProps) {
  const title = content?.title || 'Why Choose Us';
  const subtitle = content?.subtitle || 'Excellence in Every Detail';

  const defaultItems: FeatureItem[] = [
    {
      icon: 'Award',
      title: 'Premium Quality',
      description: 'We use only the finest quality wood sourced responsibly, ensuring each piece is built to last generations.',
    },
    {
      icon: 'Palette',
      title: 'Custom Design',
      description: 'Every piece is uniquely crafted to your specifications, making it truly one-of-a-kind.',
    },
    {
      icon: 'Clock',
      title: 'Timely Delivery',
      description: 'We respect your time and commit to delivering your Woodwork within the agreed timeframe.',
    },
    {
      icon: 'Shield',
      title: 'Quality Warranty',
      description: 'Every product comes with our quality warranty. We stand behind our craftsmanship.',
    },
    {
      icon: 'Hammer',
      title: 'Expert Craftsmen',
      description: 'Our team of skilled artisans brings decades of combined experience to every project.',
    },
    {
      icon: 'HeartHandshake',
      title: 'After-Sales Support',
      description: 'We provide dedicated after-sales support to ensure your complete satisfaction.',
    },
  ];

  const items: FeatureItem[] = (content?.content_json?.items as FeatureItem[]) || defaultItems;

  return (
    <section className="py-24 bg-secondary/40 noise relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            // Dynamically resolve icon component
            const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-8 bg-white rounded-2xl border border-stone-200/55 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
