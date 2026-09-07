import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { getSettings } from '@/actions/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-[72px] md:pt-[80px]">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
