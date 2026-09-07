'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteFileFromCloudinary } from '@/actions/storage';
import { gallerySchema } from '@/lib/validations/gallery';
import type { ActionResult, Gallery, GalleryImage, GalleryFilters, PaginatedResult } from '@/types';
import { slugify } from '@/lib/utils';

function normalizeGallery(id: string, data: any): Gallery {
  const images = (data.images || []).map((img: any, idx: number) => {
    const publicId = img.public_id || img.publicId || img.storage_path || img.storagePath || '';
    return {
      id: img.id || `gimg-${idx}`,
      gallery_id: id,
      public_id: publicId,
      storage_path: publicId,
      url: img.url || '',
      width: img.width || null,
      height: img.height || null,
      alt_text: img.alt_text || null,
      is_cover: img.is_cover ?? (idx === 0),
      display_order: img.display_order ?? idx,
      created_at: img.created_at || new Date().toISOString(),
    };
  });

  const coverImage = images.find((img: any) => img.is_cover)?.url || data.cover_image_url || (images[0]?.url || null);

  return {
    id,
    title: data.title || '',
    slug: data.slug || slugify(data.title || id),
    description: data.description || null,
    category: data.category || null,
    is_featured: data.is_featured ?? false,
    is_visible: data.is_visible ?? true,
    display_order: typeof data.display_order === 'number' ? data.display_order : 0,
    cover_image_url: coverImage,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    images,
  };
}

export async function getGalleryAlbums(
  filters: GalleryFilters = {}
): Promise<PaginatedResult<Gallery>> {
  try {
    const { category, is_featured, page = 1, pageSize = 12 } = filters;

    const snapshot = await getDocs(collection(db, 'gallery'));
    let albums: Gallery[] = snapshot.docs.map(d => normalizeGallery(d.id, d.data()));

    albums = albums.filter(a => a.is_visible);

    if (category) {
      albums = albums.filter(a => a.category === category);
    }
    if (is_featured !== undefined) {
      albums = albums.filter(a => a.is_featured === is_featured);
    }

    albums.sort((a, b) => a.display_order - b.display_order);

    const total = albums.length;
    const from = (page - 1) * pageSize;
    const paginated = albums.slice(from, from + pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (error) {
    console.error('Error fetching gallery albums:', error);
    return { data: [], total: 0, page: 1, pageSize: 12, totalPages: 0 };
  }
}

export async function getAllGalleryAlbums(): Promise<Gallery[]> {
  try {
    const snapshot = await getDocs(collection(db, 'gallery'));
    const albums = snapshot.docs.map(d => normalizeGallery(d.id, d.data()));
    albums.sort((a, b) => a.display_order - b.display_order);
    return albums;
  } catch (error) {
    return [];
  }
}

export async function getFeaturedGallery(): Promise<Gallery[]> {
  try {
    const snapshot = await getDocs(collection(db, 'gallery'));
    const albums = snapshot.docs.map(d => normalizeGallery(d.id, d.data()));
    return albums
      .filter(a => a.is_visible && a.is_featured)
      .sort((a, b) => a.display_order - b.display_order)
      .slice(0, 6);
  } catch (error) {
    return [];
  }
}

export async function createGalleryAlbum(formData: unknown): Promise<ActionResult<Gallery>> {
  const parsed = gallerySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const docRef = doc(collection(db, 'gallery'));
    const now = new Date().toISOString();
    const payload = {
      id: docRef.id,
      title: parsed.data.title,
      slug: parsed.data.slug || slugify(parsed.data.title),
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      is_featured: parsed.data.is_featured ?? false,
      is_visible: parsed.data.is_visible ?? true,
      display_order: parsed.data.display_order ?? 0,
      cover_image_url: null,
      images: [],
      created_at: now,
      updated_at: now,
    };

    await setDoc(docRef, payload);
    const album = normalizeGallery(docRef.id, payload);

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, data: album, message: 'Gallery album created' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create gallery album' };
  }
}

export async function updateGalleryAlbum(
  id: string,
  formData: unknown
): Promise<ActionResult<Gallery>> {
  const parsed = gallerySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed' };
  }

  try {
    const docRef = doc(db, 'gallery', id);
    const now = new Date().toISOString();
    await updateDoc(docRef, {
      ...parsed.data,
      updated_at: now,
    });

    const updated = await getDoc(docRef);
    const album = normalizeGallery(id, updated.data());

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, data: album, message: 'Album updated' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryAlbum(id: string): Promise<ActionResult<void>> {
  try {
    const docRef = doc(db, 'gallery', id);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      const images: any[] = snapshot.data()?.images || [];
      for (const img of images) {
        const publicId = img.public_id || img.storage_path;
        if (publicId) {
          try {
            await deleteFileFromCloudinary(publicId);
          } catch (e) {}
        }
      }
    }

    await deleteDoc(docRef);

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addGalleryImages(
  galleryId: string,
  images: Array<{
    public_id?: string;
    storage_path?: string;
    url: string;
    width?: number;
    height?: number;
    alt_text?: string;
    is_cover?: boolean;
    display_order: number;
  }>
): Promise<ActionResult<GalleryImage[]>> {
  try {
    const docRef = doc(db, 'gallery', galleryId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return { success: false, error: 'Album not found' };

    const existingImages: any[] = snapshot.data()?.images || [];
    const newImages = images.map((img, i) => {
      const publicId = img.public_id || img.storage_path || `gallery/${Date.now()}_${i}`;
      return {
        id: `gimg-${Date.now()}-${i}`,
        gallery_id: galleryId,
        public_id: publicId,
        storage_path: publicId,
        url: img.url,
        width: img.width || null,
        height: img.height || null,
        alt_text: img.alt_text || null,
        is_cover: img.is_cover ?? (existingImages.length === 0 && i === 0),
        display_order: existingImages.length + i,
        created_at: new Date().toISOString(),
      };
    });

    const combined = [...existingImages, ...newImages];
    const coverUrl = combined.find(i => i.is_cover)?.url || combined[0]?.url || null;

    await updateDoc(docRef, {
      images: combined,
      cover_image_url: coverUrl,
      updated_at: new Date().toISOString(),
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, data: newImages as GalleryImage[] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryImage(
  imageId: string,
  storagePath: string
): Promise<ActionResult<void>> {
  try {
    const snapshot = await getDocs(collection(db, 'gallery'));
    for (const d of snapshot.docs) {
      const images: any[] = d.data().images || [];
      if (images.some(i => i.id === imageId || i.public_id === storagePath || i.storage_path === storagePath)) {
        const filtered = images.filter(i => i.id !== imageId && i.public_id !== storagePath && i.storage_path !== storagePath);
        const coverUrl = filtered.find(i => i.is_cover)?.url || filtered[0]?.url || null;

        await updateDoc(d.ref, {
          images: filtered,
          cover_image_url: coverUrl,
          updated_at: new Date().toISOString(),
        });

        if (storagePath) {
          try {
            await deleteFileFromCloudinary(storagePath);
          } catch (e) {}
        }
        break;
      }
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
