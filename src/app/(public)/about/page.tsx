import React from 'react';
import type { Metadata } from 'next';
import { getHomepageSection } from '@/actions/settings';
import { Check, ShieldCheck, Heart, UserCheck } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Heritage Story',
  description: 'Learn about Ranjan Enterprises heritage, custom hand-made Woodwork workshop in Mumbai, and core commitments.',
};

export default async function AboutPage() {
  const content = await getHomepageSection('about');

  const title = content?.title || 'About Ranjan Enterprises';
  const subtitle = content?.subtitle || '15+ Years of Master Craftsmanship';
  const description = content?.description || 
    'Ranjan Enterprises has been crafting premium wooden Woodwork and custom wooden works for over 15 years. We combine traditional craftsmanship with modern design to create pieces that last a lifetime.';

  const stats = (content?.content_json?.stats as Array<{ value: string; label: string }>) || [
    { value: '500+', label: 'Projects Completed' },
    { value: '15+', label: 'Years Experience' },
    { value: '50+', label: 'Happy Clients' },
    { value: '100%', label: 'Custom Made' },
  ];

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="section-subtitle">{subtitle}</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed font-light mt-2">
              {description}
            </p>
            <p className="text-stone-700 text-sm leading-relaxed font-medium">
              We specialize in selecting premium lumber, tailoring pieces exactly to architectural specs, and hand-finishing with the highest class of varnishes.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-luxury-lg border border-stone-250 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
                alt="Craftsmanship Workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-accent/20 rounded-br-2xl -z-10" />
          </div>
        </div>

        {/* Stats segment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-white border border-stone-200/50 shadow-luxury rounded-2xl text-center">
              <span className="block font-serif text-3xl font-extrabold text-primary mb-1">
                {stat.value}
              </span>
              <span className="block text-xs font-bold text-stone-500 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Core Values grid */}
        <div className="flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="section-subtitle">Our Workshop Commitments</span>
            <h2 className="font-serif text-3xl font-bold text-stone-850">
              Crafting Values We Live By
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="flex flex-col gap-4 bg-white p-8 rounded-2xl border border-stone-200 shadow-luxury text-center items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Authentic Material
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                We use premium, certified Teak, Sheesham, and Rosewood logs, seasoned to perfect moisture content to prevent bending.
              </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col gap-4 bg-white p-8 rounded-2xl border border-stone-200 shadow-luxury text-center items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Heritage Artistry
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                We blend traditional mortise-and-tenon wood joinery with contemporary aesthetic lines for structural legacy.
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col gap-4 bg-white p-8 rounded-2xl border border-stone-200 shadow-luxury text-center items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Bespoke Tailoring
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                From size edits to custom handles, we build pieces precisely customized to your specific space.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
