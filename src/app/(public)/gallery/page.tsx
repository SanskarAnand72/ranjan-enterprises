import React from 'react';
import { getAllGalleryAlbums } from '@/actions/gallery';
import GalleryClient from '@/components/gallery/GalleryClient';
import type { Metadata } from 'next';

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = {
  title: 'Gallery of Masterpieces',
  description: 'View our gallery of completed projects. Custom solid wood creations from premium teak, sheesham, and mango wood.',
};

export default async function GalleryPage() {
  const albums = await getAllGalleryAlbums();

  return (
    <GalleryClient albums={albums} />
  );
}
