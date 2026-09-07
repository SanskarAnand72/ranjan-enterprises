'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Award, Clock, Users, Hammer, ShieldCheck, Heart, 
  UserCheck, Sparkles, CheckCircle2, ArrowRight, MessageSquare, Phone 
} from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { HomepageContent, SiteSettings } from '@/types';

interface AboutPageClientProps {
  content?: HomepageContent | null;
  settings?: SiteSettings;
}

const ARTISAN_WORKSHOP_IMG = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop';
const WOODEN_FURNITURE_IMG = 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop';
const WOOD_DOOR_DETAILS_IMG = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop';

export default function AboutPageClient({ content, settings }: AboutPageClientProps) {
  const title = content?.title || 'About Ranjan Enterprises';
  const subtitle = content?.subtitle || '15+ Years of Master Craftsmanship';
  const description = content?.description || 
    'Ranjan Enterprises has been crafting architectural wooden doors, carved gates, bespoke furniture, and luxury interior woodwork for over 15 years. We combine ancient joinery techniques with modern precision to create pieces of enduring beauty.';

  const stats = [
    { value: '500+', label: 'Projects Delivered', icon: Award, desc: 'Doors, gates, wardrobes & bespoke furniture' },
    { value: '15+', label: 'Years Heritage', icon: Clock, desc: 'Master artisans with traditional expertise' },
    { value: '100%', label: 'Satisfied Clients', icon: Users, desc: 'High customer retention & referrals' },
    { value: 'Bespoke', label: 'Custom Tailored', icon: Hammer, desc: 'Made to exact dimensions & wood choice' },
  ];

  const waText = 'Hello Ranjan Enterprises, I read about your craftsmanship story on your website and would like to discuss a custom woodwork project.';
  const waUrl = whatsappUrl(settings?.whatsapp || settings?.phone || '+918859123538', waText);

  return (
    <div className="py-12 md:py-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24">
        
        {/* Hero & Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copywriting */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="section-subtitle">{subtitle}</span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {title}
              </h1>
            </div>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light">
              {description}
            </p>

            <div className="p-6 bg-stone-50 border-l-4 border-primary rounded-r-2xl border-stone-200/80 flex flex-col gap-2 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-stone-900">Our Atelier Philosophy</h3>
              <p className="text-stone-700 text-sm leading-relaxed font-normal">
                Every piece of wood has a unique soul and grain pattern. At Ranjan Enterprises, we carefully hand-select each plank of Teak, Sheesham, and Rosewood, kiln-seasoning them to optimal moisture levels before shaping them into handcrafted gates, doors, wardrobes, and luxury furniture.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3.5 px-7 text-xs uppercase font-bold tracking-wider shadow-luxury hover:shadow-luxury-hover"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consult Master Craftsman</span>
              </a>

              <Link
                href="/products"
                className="btn-outline py-3.5 px-7 text-xs uppercase font-bold tracking-wider text-stone-800 border-stone-300 hover:bg-stone-100"
              >
                <span>View Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Dual Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Primary Artisan Image */}
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-luxury-lg border border-stone-250/80 bg-stone-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ARTISAN_WORKSHOP_IMG}
                alt="Master Carpenter at Work"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 z-10 text-white font-serif text-sm font-semibold tracking-wide">
                Artisan Woodwork & Hand Planing
              </span>
            </div>

            {/* Inset Secondary Image */}
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-48 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-20 bg-stone-100 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={WOODEN_FURNITURE_IMG}
                alt="Handcrafted Solid Wood Furniture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Decorative background accent */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl -z-10" />
          </motion.div>

        </div>

        {/* Redesigned Statistics Section */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <span className="section-subtitle">Heritage in Numbers</span>
            <h2 className="font-serif text-3xl font-bold text-foreground">
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
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 bg-white border border-stone-200/70 shadow-luxury hover:shadow-luxury-hover rounded-3xl transition-all duration-300 flex flex-col justify-between gap-4 group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-4xl font-extrabold text-primary tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <span className="text-2xs text-muted-foreground font-light leading-relaxed">
                      {stat.desc}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Master Craftsmanship Pillars */}
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="section-subtitle">Our Guarantees</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Why Architectural Designers Trust Us
            </h2>
            <p className="text-muted-foreground text-sm font-light">
              Built on uncompromising standards for materials, structural joinery, and exquisite surface finishes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 bg-white rounded-3xl border border-stone-200/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                100% Seasoned Hardwoods
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                We select premium Teak, Sheesham, Sal, and Mahogany timber, seasoned to ideal moisture levels to prevent warping, cracking, or shrinkage.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 bg-white rounded-3xl border border-stone-200/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Artisan Hand Carving
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Our craftsmen execute traditional Indian hand carvings alongside sleek modern architectural profiles for doors, gates, and furniture.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 bg-white rounded-3xl border border-stone-200/80 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Architectural Customization
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Every door frame, gate panel, and wardrobe module is custom engineered to match your exact floor plans and interior vision.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Craftsmanship Process Showcase */}
        <div className="p-8 sm:p-12 bg-stone-900 text-white rounded-3xl shadow-luxury-lg flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Workshop Process</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                From Raw Timber to Heirloom Luxury
              </h2>
            </div>
            <p className="text-stone-400 text-xs max-w-md font-light leading-relaxed">
              Our 4-step artisan process guarantees long-lasting durability and flawless aesthetic finishes for every custom creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Timber Selection', text: 'Inspecting grain density, moisture content, and wood character.' },
              { step: '02', title: 'Seasoning & Prep', text: 'Controlled kiln drying and surface planing for structural balance.' },
              { step: '03', title: 'Joinery & Carving', text: 'Precision mortise-and-tenon joints and intricate hand detailing.' },
              { step: '04', title: 'PU Polishing', text: 'Multi-coat natural oil or PU varnish sealing for weather resistance.' },
            ].map((proc, idx) => (
              <div key={idx} className="p-5 bg-stone-800/60 rounded-2xl border border-stone-700/60 flex flex-col gap-3">
                <span className="font-serif text-2xl font-bold text-accent">{proc.step}</span>
                <h4 className="font-serif font-bold text-white text-base">{proc.title}</h4>
                <p className="text-stone-400 text-xs font-light leading-relaxed">{proc.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 sm:p-12 bg-amber-50 border border-amber-200/80 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Start Your Project</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Ready to Design Custom Woodwork?
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm font-light max-w-xl">
              Talk directly with our woodworking atelier to discuss custom sizes, timber options, pricing, and project timelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp py-3.5 px-6 text-xs uppercase font-bold tracking-wider shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="btn-outline py-3.5 px-6 text-xs uppercase font-bold tracking-wider text-stone-900 border-stone-400 hover:bg-stone-200"
              >
                <Phone className="w-4 h-4 text-accent" />
                <span>Call Workshop</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
