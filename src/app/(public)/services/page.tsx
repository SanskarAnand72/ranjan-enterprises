import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, Award } from 'lucide-react';
import { getServices } from '@/actions/services';
import ServiceCardGrid from '@/components/services/ServiceCardGrid';
import type { Service } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Craftsmanship Services | Ranjan Enterprises',
  description: 'From custom entrances and luxury interiors to handcrafted furniture and restoration work, we deliver bespoke woodworking solutions tailored to every space.',
};

export default async function ServicesPage() {
  const servicesData = await getServices(true);

  const defaultServices: Service[] = [
    {
      id: 'srv-1',
      title: 'Custom Wooden Gates & Main Entrances',
      description: 'Heavy-duty solid teak and sheesham security gates and grand main entrance portals engineered with traditional mortise-and-tenon joinery and weather-resistant sealants.',
      icon: 'DoorClosed',
      features: ['Solid Teak & Sheesham', 'Mortise & Tenon Joinery', 'Polyurethane Weather Coating', 'Custom Carved Crests'],
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-2',
      title: 'Solid Wood Doors & Door Frames',
      description: 'Hand-carved solid teak main doors, double entryways, and anti-warp door frames crafted with 5-stage Italian PU polish and kiln-seasoned timber.',
      icon: 'ShieldCheck',
      features: ['100% Kiln-Seasoned Teak', 'Vastu-Compliant Carvings', 'Heavy-Duty Brass Hardware', 'Multi-Point Lock Ready'],
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-3',
      title: 'Modular Kitchen & Cabinetry',
      description: 'Waterproof BWR hardwood kitchen cabinets, island counters, pantry units, and dining storage fitted with soft-close German hardware.',
      icon: 'Grid',
      features: ['BWR Hardwood Plywood Core', 'Soft-Close Blum Fittings', 'Solid Wood Drawer Fronts', 'Custom Staining Options'],
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-4',
      title: 'Wardrobes & Storage Solutions',
      description: 'Floor-to-ceiling walk-in wardrobes, sliding door closets, and custom bedroom storage crafted with premium veneer fronts and organized internals.',
      icon: 'Box',
      features: ['Modular & Walk-In Wardrobes', 'Soft-Close Drawers', 'Concealed LED Strip Lighting', 'Custom Compartments'],
      is_active: true,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-5',
      title: 'Interior Wooden Paneling & Wall Cladding',
      description: 'Architectural acoustic fluted wall paneling, carved wooden false ceilings, partition screens, and custom wainscoting for luxury interiors.',
      icon: 'Layers',
      features: ['Fluted & Slotted Paneling', 'Zero-VOC Italian Matte Polish', 'Acoustic Sound Dampening', 'Hidden Concealed Hardware'],
      is_active: true,
      display_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-6',
      title: 'Pooja Mandirs & Temple Architecture',
      description: 'Intricately hand-carved wooden Pooja rooms, mandir shrines, CNC jaali cutwork, brass accents, and integrated warm LED soft-lighting.',
      icon: 'Sparkles',
      features: ['100% Solid Seasoned Teak', 'CNC & Hand Carved Jaali', 'Concealed Storage Drawers', 'Integrated Warm LED Illumination'],
      is_active: true,
      display_order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-7',
      title: 'Custom Furniture Manufacturing',
      description: 'Bespoke solid wood dining tables, royal sofas, bed frames, and accent furniture handcrafted to your exact dimensions and aesthetic vision.',
      icon: 'Hammer',
      features: ['Custom 3D CAD Blueprinting', 'Grade-A Hardwood Species', 'Hand-rubbed Polish', 'Lifetime Structural Warranty'],
      is_active: true,
      display_order: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-8',
      title: 'Restoration & Re-Polishing',
      description: 'Expert structural repair, 5-stage fine sanding, old-growth timber restoration, and hand-rubbed oil or Italian polyurethane re-polishing.',
      icon: 'Wrench',
      features: ['Old-Growth Wood Repair', '5-Stage Fine Sanding', 'Italian PU Lacquer Polish', 'Termite & Moisture Treatment'],
      is_active: true,
      display_order: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-9',
      title: 'CNC Cutting & Custom Wood Designs',
      description: 'Precision 3D CNC wood carving, geometric lattice jaali panels, custom crests, and intricate architectural motifs tailored to custom specs.',
      icon: 'Cpu',
      features: ['Sub-Millimeter CNC Precision', 'Custom 2D/3D File Import', 'Intricate Jaali Patterns', 'Clean Carved Reliefs'],
      is_active: true,
      display_order: 9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'srv-10',
      title: 'Commercial & Office Woodwork',
      description: 'Executive boardroom tables, reception counters, acoustic office partitions, and wall cladding designed for durability and corporate prestige.',
      icon: 'Building2',
      features: ['Heavy Commercial Durability', 'Integrated Cable Management', 'Acoustic Partition Panels', 'Fast On-Site Fitting'],
      is_active: true,
      display_order: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Combine DB services or use all 10 default services
  const services = servicesData && servicesData.length >= 8 ? servicesData : defaultServices;

  const processSteps = [
    {
      step: '01',
      title: 'Blueprint & Consultation',
      desc: 'Our master joiner evaluates your site dimensions or CAD drawings, advising on wood species and load capacities.',
    },
    {
      step: '02',
      title: 'Timber Kiln Seasoning',
      desc: 'Grade-A Teak, Sheesham, or Rosewood is moisture-tested under 10-12% to guarantee zero warping over decades.',
    },
    {
      step: '03',
      title: 'Mortise & Tenon Joinery',
      desc: 'Traditional interlocking joints are hand-fitted by senior artisans with 15+ years of experience.',
    },
    {
      step: '04',
      title: 'Italian PU Polish & Fitting',
      desc: 'Finished with 5-stage fine sanding and Italian lacquer before white-glove on-site installation.',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="section-subtitle">Atelier Capability</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mt-1">
            Our Craftsmanship Services
          </h1>
          <div className="divider-gold my-4" />
          <p className="text-muted-foreground font-light text-base sm:text-lg leading-relaxed">
            From custom entrances and luxury interiors to handcrafted furniture and restoration work, we deliver bespoke woodworking solutions tailored to every space.
          </p>
        </div>

        {/* 10 Services Clean Grid (No Images) */}
        <div className="mb-20">
          <ServiceCardGrid services={services} />
        </div>

        {/* Process Lifecycle Section */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-14 mb-20 shadow-2xl relative overflow-hidden border border-amber-900/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-accent tracking-widest uppercase mb-2 block">
              Our Joinery Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              How We Turn Raw Timber Into Architectural Masterpieces
            </h2>
            <p className="text-stone-400 font-light text-sm mt-3 leading-relaxed">
              Every commission follows a rigid 4-stage quality protocol refined over 25+ years in our workshop.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((item) => (
              <div key={item.step} className="flex flex-col bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300">
                <span className="font-serif text-4xl font-bold text-accent mb-3">
                  {item.step}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Blueprint CTA Banner */}
        <div className="bg-gradient-to-r from-stone-100 via-amber-50/50 to-stone-100 border border-stone-200/80 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-luxury">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Have Custom Architectural Blueprints or Drawings?
          </h2>
          <p className="text-muted-foreground font-light text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Send us your 2D plans, 3D renders, or Pinterest moodboards. Our head artisan will review your dimensions and provide a transparent itemized estimate.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/919412165099?text=Hello%20Ranjan%20Enterprises,%20I%20have%20a%20custom%20woodworking%20design%20I'd%20like%20to%20discuss."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-8 py-3.5 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Send Blueprints on WhatsApp
            </a>
            <Link href="/contact" className="btn-outline px-8 py-3.5 text-sm">
              Book Workshop Consultation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}



