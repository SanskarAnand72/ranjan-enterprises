'use client';

import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { whatsappUrl } from '@/lib/utils';
import type { SiteSettings } from '@/types';

interface FloatingWhatsAppProps {
  settings?: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const phone = settings?.whatsapp || settings?.phone || '+918859123538';
  const url = whatsappUrl(
    phone,
    'Hello Ranjan Enterprises, I am browsing your website catalog and would like to inquire about bespoke woodworking.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-luxury-hover hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white/20"
      >
        <MessageSquare className="w-7 h-7 fill-white/10" />
        
        {/* Tooltip Label */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-stone-700">
          Chat with Atelier
        </span>

        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />
      </a>
    </div>
  );
}
