import React from 'react';
import type { Metadata } from 'next';
import { getSettings, getHomepageSection } from '@/actions/settings';
import ContactSection from '@/components/sections/ContactSection';

export const metadata: Metadata = {
  title: 'Contact Our Workshop',
  description: 'Inquire regarding custom Woodwork or woodwork. Workshop address, phone, WhatsApp contact details.',
};

export default async function ContactPage() {
  const [settings, content] = await Promise.all([
    getSettings(),
    getHomepageSection('contact'),
  ]);

  return (
    <ContactSection
      settings={settings}
      content={content}
    />
  );
}
