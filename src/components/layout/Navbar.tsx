'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn, whatsappUrl } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import type { SiteSettings } from '@/types';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const waUrl = whatsappUrl(
    settings.whatsapp || settings.phone || '+918859123538',
    'Hello Ranjan Enterprises, I am browsing your custom woodwork collection and would like to make an inquiry.'
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'glass shadow-luxury py-3 border-b border-wood-200/80'
          : 'bg-gradient-to-b from-stone-950/60 via-stone-900/20 to-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-wood-700/10 border border-amber-800/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="font-serif font-bold text-xl tracking-tighter">R</span>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-serif text-xl sm:text-2xl font-bold tracking-wide transition-colors duration-300",
                isScrolled ? "text-foreground group-hover:text-primary" : "text-white group-hover:text-accent-light"
              )}>
                {settings.business_name || 'RANJAN'}
              </span>
              <span className="font-display text-[9px] sm:text-[10px] tracking-[0.25em] text-accent uppercase font-semibold -mt-1">
                HANDCRAFTED JOINERY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 relative py-1.5',
                    isScrolled 
                      ? (isActive ? 'text-primary font-bold' : 'text-stone-700 hover:text-primary')
                      : (isActive ? 'text-accent-light font-bold' : 'text-stone-200 hover:text-white')
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className={cn(
                  "flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 px-3 py-1.5 rounded-full border border-transparent",
                  isScrolled 
                    ? "text-stone-700 hover:text-primary hover:border-wood-200"
                    : "text-stone-200 hover:text-white hover:border-white/20"
                )}
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>Call Workshop</span>
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp py-2 px-4.5 text-xs uppercase tracking-wider shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Quote</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors focus:outline-none",
                isScrolled ? "text-foreground hover:bg-stone-100" : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 top-[64px] z-40 bg-stone-950/95 backdrop-blur-xl md:hidden transition-all duration-500 transform border-t border-amber-900/30',
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        )}
      >
        <div className="flex flex-col h-full px-6 py-8 justify-between text-stone-100">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-4 border-b border-stone-800 text-accent">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="font-display text-xs tracking-widest uppercase">Master Joinery Workshops</span>
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-serif text-2xl font-semibold transition-all duration-300 flex items-center justify-between',
                    isActive ? 'text-accent tracking-wide pl-2 border-l-2 border-accent' : 'text-stone-300 hover:text-white'
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowRight className={cn("w-4 h-4 opacity-50", isActive && "text-accent opacity-100")} />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 mb-10 border-t border-stone-800 pt-6">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-between p-4 bg-stone-900 rounded-xl text-stone-200 border border-stone-800 hover:border-amber-800/50"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Direct Line</span>
                </span>
                <span className="text-xs font-semibold text-accent tracking-wider">{settings.phone}</span>
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp justify-center w-full py-3.5 text-xs uppercase tracking-wider font-semibold rounded-xl"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Inquire via WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

