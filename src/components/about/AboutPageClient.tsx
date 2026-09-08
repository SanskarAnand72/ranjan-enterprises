'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Award, Clock, Users, Hammer, ShieldCheck, Heart, 
  UserCheck, Sparkles, CheckCircle2, ArrowRight, MessageSquare, Phone, Compass, Shield
} from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface AboutPageClientProps {
  content?: HomepageContent | null;
  settings?: SiteSettings;
}

const ARTISAN_WORKSHOP_IMG = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop';
const WOODEN_FURNITURE_IMG = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop';

export default function AboutPageClient({ content, settings }: AboutPageClientProps) {
  const title = content?.title || 'Heritage of Artisanal Woodworking';
  const subtitle = content?.subtitle || '15+ Years of Dedicated Mastery';
  const description = content?.description || 
    'Ranjan Enterprises has been shaping solid timber into heirloom architectural doors, carved mandirs, custom wardrobes, and luxury residential woodwork for over 15 years. We pair traditional joinery methods with modern precision to create pieces of enduring beauty.';

  const stats = [
    { value: '500+', label: 'Joinery Projects Delivered', icon: Award, desc: 'Solid doors, mandirs & bespoke furniture' },
    { value: '15+', label: 'Years Master Workshop', icon: Clock, desc: 'Decades of combined woodworking experience' },
    { value: '100%', label: 'Kiln Dried Timber', icon: ShieldCheck, desc: 'Termite proof & moisture controlled' },
    { value: 'Bespoke', label: 'Custom Engineered', icon: Hammer, desc: 'Tailored precisely to your architectural plans' },
  ];

  const timberGuide = [
    {
      name: 'Grade-A Seasoned Teak',
      features: 'High natural oil content, golden-amber grain, superior water and weather resistance.',
      bestFor: 'Main entrance doors, architectural gates, and luxury exterior frames.',
    },
    {
      name: 'Rich Sheesham (Indian Rosewood)',
      features: 'Distinct rich dark grain streaks, exceptional density, high tensile strength.',
      bestFor: 'Bespoke living furniture, custom dining tables, and carved mandirs.',
    },
    {
      name: 'Mango Wood',
      features: 'Warm honey tones, eco-friendly hardwood, smooth finish for hand polishing.',
      bestFor: 'Modern interior wardrobes, wall paneling, and decorative accents.',
    },
    {
      name: 'Sal & Mahogany',
      features: 'Ultra-dense structural timber, heavy-duty load capacity, long-term stability.',
      bestFor: 'Door frames, structural joinery beams, and window casings.',
    },
  ];

  const waText = 'Hello Ranjan Enterprises, I read about your craftsmanship story on your website and would like to discuss a custom woodwork project.';
  const waUrl = whatsappUrl(settings?.whatsapp || settings?.phone || '+918859123538', waText);

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24">
        
        {/* Hero & Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copywriting */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <div className="section-tag w-fit mb-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>WORKSHOP HERITAGE</span>
              </div>
              <span className="font-display text-base font-light text-primary tracking-widest uppercase italic">
                {subtitle}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-950 leading-tight">
                {title}
              </h1>
            </div>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-light">
              {description}
            </p>

            <div className="p-6 bg-white border-l-4 border-primary rounded-r-2xl border-stone-200/80 flex flex-col gap-2 shadow-luxury">
              <h3 className="font-serif text-lg font-bold text-stone-950">Our Workshop Philosophy</h3>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-normal">
                Every log of wood possesses an individual story and grain orientation. At Ranjan Enterprises, we individually inspect each plank of Teak, Sheesham, and Mango timber, kiln-seasoning them to optimal moisture levels before shaping them with precision mortise and tenon joinery.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs uppercase tracking-wider font-semibold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consult Master Craftsman</span>
              </a>

              <Link
                href="/products"
                className="btn-outline text-xs uppercase tracking-wider font-semibold"
              >
                <span>View Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Dual Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Primary Artisan Image */}
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-luxury-lg border border-stone-200/80 bg-stone-900 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ARTISAN_WORKSHOP_IMG}
                alt="Master Carpenter at Work"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-dark border border-amber-800/30 flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent flex-shrink-0" />
                <div className="flex flex-col text-white">
                  <span className="text-xs font-bold uppercase tracking-wider">Hand-Polished Finish</span>
                  <span className="text-[11px] text-stone-300">Natural Oils & Organic Wood Wax</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Statistics Section */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="section-subtitle">Heritage in Numbers</span>
            <h2 className="font-serif text-3xl font-bold text-stone-950">
              Proven Atelier Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 bg-white border border-stone-200/80 shadow-luxury hover:shadow-luxury-hover rounded-3xl transition-all duration-300 flex flex-col justify-between gap-4 group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-wood-700/10 text-primary border border-amber-800/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-4xl font-extrabold text-primary tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-stone-950 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <span className="text-[11px] text-stone-500 font-light leading-relaxed">
                      {stat.desc}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timber Specimen Guide */}
        <div className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <div className="section-tag w-fit mx-auto mb-1">
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span>TIMBER SELECTION GUIDE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              Grade-A Hardwood Species
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light">
              We guide you in selecting the ideal wood species for strength, grain beauty, and durability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timberGuide.map((wood, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-luxury flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{wood.name}</span>
                <p className="text-stone-600 text-xs leading-relaxed font-light">{wood.features}</p>
                <div className="pt-3 border-t border-stone-100 mt-auto text-2xs font-semibold text-stone-800">
                  <span className="text-stone-400 block font-normal uppercase tracking-widest text-[9px]">Best Applications</span>
                  {wood.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Craftsmanship Process Showcase */}
        <div className="p-8 sm:p-12 bg-stone-950 text-white rounded-3xl shadow-luxury-lg flex flex-col gap-10 noise border border-stone-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Workshop Process</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                From Raw Timber to Heirloom Masterpiece
              </h2>
            </div>
            <p className="text-stone-400 text-xs max-w-md font-light leading-relaxed">
              Our 4-step artisan process guarantees long-lasting durability and flawless aesthetic finishes for every custom creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Timber Selection', text: 'Inspecting grain density, moisture content, and wood character.' },
              { step: '02', title: 'Kiln Drying & Seasoning', text: 'Controlled kiln drying and surface planing for structural balance.' },
              { step: '03', title: 'Joinery & Carving', text: 'Precision mortise-and-tenon joints and intricate hand detailing.' },
              { step: '04', title: 'Oil & PU Polishing', text: 'Multi-coat natural oil or PU varnish sealing for weather resistance.' },
            ].map((proc, idx) => (
              <div key={idx} className="p-5 bg-stone-900/80 rounded-2xl border border-stone-800 flex flex-col gap-3">
                <span className="font-serif text-2xl font-bold text-accent">{proc.step}</span>
                <h4 className="font-serif font-bold text-white text-base">{proc.title}</h4>
                <p className="text-stone-400 text-xs font-light leading-relaxed">{proc.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 sm:p-12 bg-cream-gradient border border-stone-200/80 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Start Your Custom Project</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              Ready to Design Custom Woodwork?
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl">
              Talk directly with our woodworking atelier to discuss custom sizes, timber options, pricing, and project timelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs uppercase tracking-wider font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="btn-outline text-xs uppercase tracking-wider font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>Call Workshop</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

