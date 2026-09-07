import React from 'react';
import { getAllGalleryAlbums } from '@/actions/gallery';
import GalleryManager from '@/components/admin/GalleryManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery Portfolio Management',
};

export default async function AdminGalleryPage() {
  const albums = await getAllGalleryAlbums();

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          Workspace Portfolio
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Gallery Management
        </h1>
      </div>

      {/* Gallery manager component */}
      <GalleryManager initialAlbums={albums} />

    </div>
  );
}
