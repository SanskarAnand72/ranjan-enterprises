'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, ExternalLink, Camera, Play, ArrowUpRight, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const waUrl = whatsappUrl(
    settings.whatsapp || settings.phone || '+918859123538',
    'Hello Ranjan Enterprises, I am browsing your custom woodwork collection and would like to ask some questions.'
  );

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-900 noise relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="h-1 w-full bg-wood-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        
        {/* Brand & Guarantee Header Strip */}
        <div className="pb-12 mb-12 border-b border-stone-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-wood-700/20 border border-amber-800/40 flex items-center justify-center text-accent group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="font-serif font-bold text-2xl">R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-accent transition-colors duration-300">
                {settings.business_name || 'RANJAN'}
              </span>
              <span className="font-display text-[10px] tracking-[0.25em] text-accent uppercase font-medium -mt-1">
                ENTERPRISES — BESPOKE WOODWORK
              </span>
            </div>
          </Link>

          {/* Craft Guarantee Seal */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">100% Solid Seasoned Wood</span>
              <span className="text-[10px] text-stone-400">Kiln Dried • Hand Polished • Lifetime Guarantee</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-5">
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Tailoring heritage woodworking techniques with modern interior aesthetics. We craft heirloom solid wood doors, custom furniture, carved mandirs, and bespoke joinery.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="Facebook"
                >
                  <ExternalLink className="w-4 h-4 text-stone-300" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="Instagram"
                >
                  <Camera className="w-4 h-4 text-stone-300" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="YouTube"
                >
                  <Play className="w-4 h-4 text-stone-300" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-5">
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase">Navigation</h3>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-stone-400 font-medium">
              <li>
                <Link href="/" className="hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group">
                  <span>Home Showcase</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent" />
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group">
                  <span>Master Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group">
                  <span>Craftsmanship & Heritage</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent" />
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group">
                  <span>Project Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors duration-300 flex items-center gap-1.5 group">
                  <span>Consultation & Contact</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Woodwork Specialties */}
          <div className="flex flex-col gap-5">
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase">Specialties</h3>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-stone-400">
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300">
                  Teak & Rosewood Doors
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300">
                  Custom Carved Mandirs
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300">
                  Wooden Windows & Frames
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300">
                  Bespoke Living & Dining
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300">
                  Commercial Fit-Outs
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop & Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase">Workshop Contact</h3>
            <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-stone-400">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              <li>
                <a href={`tel:${settings.phone || '+918859123538'}`} className="flex items-center gap-3 hover:text-accent transition-colors group">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{settings.phone || '+91 88591 23538'}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email || 'ranjan885912@gmail.com'}`} className="flex items-center gap-3 hover:text-accent transition-colors group">
                  <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{settings.email || 'ranjan885912@gmail.com'}</span>
                </a>
              </li>
              <li className="pt-2">
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-2 px-4 text-xs uppercase tracking-wider w-full justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="font-light">
            &copy; {currentYear} {settings.business_name || 'Ranjan Enterprises'}. Handcrafted with Precision. All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

