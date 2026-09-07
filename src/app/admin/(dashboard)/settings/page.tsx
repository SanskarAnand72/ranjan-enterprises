import React from 'react';
import { getAllSettings } from '@/actions/settings';
import SettingsForm from '@/components/admin/SettingsForm';
import { parseSettingsToObject } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace Settings',
};

export default async function AdminSettingsPage() {
  const dbSettings = await getAllSettings();
  
  // Convert settings entries to object key-value pairs
  const settingsObj = parseSettingsToObject(dbSettings);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Panel
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Workshop Settings
        </h1>
      </div>

      {/* Settings Form panel client component */}
      <SettingsForm initialSettings={settingsObj} />

    </div>
  );
}
