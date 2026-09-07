'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare, ArrowRight } from 'lucide-react';
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
    settings.whatsapp || '',
    'Hello Ranjan Enterprises, I am browsing your catalog and would like to make an inquiry.'
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'glass shadow-luxury py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors duration-300">
              {settings.business_name || 'RANJAN'}
            </span>
            <span className="font-display text-[10px] tracking-[0.2em] text-accent uppercase font-medium -mt-1">
              ENTERPRISES
            </span>
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
                    'text-sm font-medium tracking-wide transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300',
                    isActive ? 'text-primary after:scale-x-100' : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>Call Us</span>
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary-dark rounded-full text-xs font-semibold tracking-wider uppercase shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2 focus:outline-none"
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
          'fixed inset-0 top-[60px] z-40 bg-background/95 backdrop-blur-md md:hidden transition-all duration-500 transform',
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        )}
      >
        <div className="flex flex-col h-full px-6 py-8 justify-between">
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-serif text-2xl font-semibold transition-colors duration-300',
                    isActive ? 'text-primary' : 'text-foreground/75'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 mb-16 border-t border-stone-200 pt-6">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-between p-4 bg-secondary rounded-xl text-foreground font-medium"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <span>Call Us</span>
                </span>
                <span className="text-sm text-muted-foreground">{settings.phone}</span>
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white font-medium rounded-xl shadow-luxury hover:bg-primary-dark transition-colors duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact via WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
