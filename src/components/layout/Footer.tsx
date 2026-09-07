'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, ExternalLink, Camera, Play, ArrowUpRight, MessageSquare } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const waUrl = whatsappUrl(
    '+918859123538',
    'Hello Ranjan Enterprises, I am browsing your catalog and would like to ask some questions.'
  );

  return (
    <footer className="bg-stone-950 text-stone-200 border-t border-stone-900 noise relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="h-1 w-full bg-wood-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex flex-col group">
              <span className="font-serif text-3xl font-bold tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                RANJAN
              </span>
              <span className="font-display text-xs tracking-[0.25em] text-accent uppercase font-medium -mt-1">
                ENTERPRISES
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Crafting premium custom woodwork. We combine heritage methods with modern design to create legacy wooden masterpieces for your home.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1"
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
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1"
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
                  className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 hover:-translate-y-1"
                  aria-label="YouTube"
                >
                  <Play className="w-4 h-4 text-stone-300" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-stone-400">
              <li>
                <Link href="/" className="hover:text-accent transition-colors duration-300 flex items-center gap-1 group">
                  <span>Home</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent transition-colors duration-300 flex items-center gap-1 group">
                  <span>Products</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors duration-300 flex items-center gap-1 group">
                  <span>About Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors duration-300 flex items-center gap-1 group">
                  <span>Contact</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">Categories</h3>
            <ul className="flex flex-col gap-3 text-sm text-stone-400">
              <li>
                <Link href="/products?category=cat-1" className="hover:text-accent transition-colors duration-300">
                  Wooden Gates
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-2" className="hover:text-accent transition-colors duration-300">
                  Wooden Windows
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-3" className="hover:text-accent transition-colors duration-300">
                  Wooden Door Frames
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-4" className="hover:text-accent transition-colors duration-300">
                  Wooden Mandir
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">Contact Details</h3>
            <ul className="flex flex-col gap-4 text-sm text-stone-400">
              <li>
                <a href="tel:+918859123538" className="flex items-start gap-3 hover:text-accent transition-colors group">
                  <Phone className="w-4 h-4 text-stone-500 group-hover:text-accent transition-colors mt-0.5" />
                  <span>+91 88591 23538</span>
                </a>
              </li>
              <li>
                <a href="mailto:ranjan885912@gmail.com" className="flex items-start gap-3 hover:text-accent transition-colors group">
                  <Mail className="w-4 h-4 text-stone-500 group-hover:text-accent transition-colors mt-0.5" />
                  <span>ranjan885912@gmail.com</span>
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-[#25D366] transition-colors group">
                  <MessageSquare className="w-4 h-4 text-stone-500 group-hover:text-[#25D366] transition-colors mt-0.5" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {currentYear} Ranjan Enterprises. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
