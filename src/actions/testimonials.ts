'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { ActionResult, Testimonial } from '@/types';

function normalizeTestimonial(id: string, data: any): Testimonial {
  return {
    id,
    customer_name: data.customer_name || data.customerName || 'Satisfied Client',
    customer_location: data.customer_location || data.customerLocation || null,
    content: data.content || '',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    avatar_url: data.avatar_url || data.avatarUrl || null,
    product_purchased: data.product_purchased || data.productPurchased || null,
    is_featured: data.is_featured ?? data.isFeatured ?? true,
    is_visible: data.is_visible ?? data.isVisible ?? true,
    display_order: typeof data.display_order === 'number' ? data.display_order : 0,
    created_at: data.created_at || data.createdAt || new Date().toISOString(),
    updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
  };
}

export async function getTestimonials(featuredOnly = false): Promise<Testimonial[]> {
  try {
    const snapshot = await getDocs(collection(db, 'testimonials'));
    let testimonials: Testimonial[] = snapshot.docs.map(d => normalizeTestimonial(d.id, d.data()));

    testimonials = testimonials.filter(t => t.is_visible);

    if (featuredOnly) {
      testimonials = testimonials.filter(t => t.is_featured);
    }

    testimonials.sort((a, b) => a.display_order - b.display_order);
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials from Firestore:', error);
    return [];
  }
}

export async function createTestimonial(formData: Partial<Testimonial>): Promise<ActionResult<Testimonial>> {
  try {
    const docRef = doc(collection(db, 'testimonials'));
    const now = new Date().toISOString();
    const payload = {
      id: docRef.id,
      customer_name: formData.customer_name || 'Client',
      customer_location: formData.customer_location || null,
      content: formData.content || '',
      rating: formData.rating ?? 5,
      avatar_url: formData.avatar_url || null,
      product_purchased: formData.product_purchased || null,
      is_featured: formData.is_featured ?? true,
      is_visible: formData.is_visible ?? true,
      display_order: formData.display_order ?? 0,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(docRef, payload);
    const testimonial = normalizeTestimonial(docRef.id, payload);

    revalidatePath('/');
    return { success: true, data: testimonial, message: 'Testimonial created successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, formData: Partial<Testimonial>): Promise<ActionResult<Testimonial>> {
  try {
    const docRef = doc(db, 'testimonials', id);
    const now = new Date().toISOString();
    const updates = {
      ...formData,
      updatedAt: now,
      updated_at: now,
    };

    await updateDoc(docRef, updates);
    const d = await getDoc(docRef);
    const testimonial = normalizeTestimonial(id, d.data());

    revalidatePath('/');
    return { success: true, data: testimonial, message: 'Testimonial updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult<void>> {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
    revalidatePath('/');
    return { success: true, data: undefined, message: 'Testimonial deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete testimonial' };
  }
}
