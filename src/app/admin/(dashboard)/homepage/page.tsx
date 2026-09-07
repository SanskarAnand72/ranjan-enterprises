import React from 'react';
import { getHomepageContent } from '@/actions/settings';
import HomepageSectionManager from '@/components/admin/HomepageSectionManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homepage Sections Management',
};

export default async function AdminHomepagePage() {
  const sections = await getHomepageContent();

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Styling
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Homepage Content Editor
        </h1>
      </div>

      {/* Homepage section manager Client module */}
      <HomepageSectionManager sections={sections} />

    </div>
  );
}
