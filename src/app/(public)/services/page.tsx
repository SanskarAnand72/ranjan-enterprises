import React from 'react';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Metadata } from 'next';
import { getServices } from '@/actions/services';
import type { Service } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Premium Services',
  description: 'Premium woodworking services including custom Woodwork, office layouts, modular Interior Woodwork design, doors and framing.',
};

export default async function ServicesPage() {
  const servicesData = await getServices(true);

  const defaultServices: Service[] = [
    {
      id: 'srv-1',
      title: 'Custom Furniture & Woodwork',
      description: 'Handcrafted custom furniture designed to fit your unique spaces with architectural perfection.',
      icon: 'Hammer',
      features: ['Bespoke Designs', 'Premium Hardwoods', 'Precision Joinery', 'Custom Finishes'],
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-2',
      title: 'Architectural Doors & Framing',
      description: 'Solid teak and hardwood doors, frames, and paneling built for durability and aesthetic grandeur.',
      icon: 'DoorClosed',
      features: ['Teak & Mahogany Options', 'Weather-Resistant Coating', 'Custom Carvings', 'Heavy-Duty Hardware'],
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const services = servicesData && servicesData.length > 0 ? servicesData : defaultServices;

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="section-subtitle">Bespoke Solutions</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Our Woodworking Services
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-light text-sm mt-1">
            We deliver complete end-to-end custom design, milling, crafting, hand-finishing, and installation services.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service: Service) => {
            const IconComponent = (Icons as any)[service.icon || 'Hammer'] || Icons.Hammer;

            return (
              <div
                key={service.id}
                className="group flex flex-col bg-white p-8 md:p-10 border border-stone-200/60 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {service.title}
                  </h2>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-stone-100 pt-6 mt-auto">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                      Key Highlights:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
