'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { ActionResult, Service } from '@/types';

function normalizeService(id: string, data: any): Service {
  return {
    id,
    title: data.title || '',
    description: data.description || '',
    icon: data.icon || 'Hammer',
    image_url: data.image_url || data.imageUrl || null,
    features: data.features || [],
    is_active: data.is_active ?? true,
    display_order: typeof data.display_order === 'number' ? data.display_order : 0,
    created_at: data.created_at || data.createdAt || new Date().toISOString(),
    updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
  };
}

export async function getServices(activeOnly = true): Promise<Service[]> {
  try {
    const snapshot = await getDocs(collection(db, 'services'));
    let services: Service[] = snapshot.docs.map(d => normalizeService(d.id, d.data()));

    if (activeOnly) {
      services = services.filter(s => s.is_active);
    }

    services.sort((a, b) => a.display_order - b.display_order);
    return services;
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    return [];
  }
}

export async function createService(formData: Partial<Service>): Promise<ActionResult<Service>> {
  try {
    const docRef = doc(collection(db, 'services'));
    const now = new Date().toISOString();
    const payload = {
      id: docRef.id,
      title: formData.title || 'New Woodworking Service',
      description: formData.description || '',
      icon: formData.icon || 'Hammer',
      features: formData.features || [],
      is_active: formData.is_active ?? true,
      display_order: formData.display_order ?? 0,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(docRef, payload);
    const service = normalizeService(docRef.id, payload);

    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, data: service, message: 'Service created successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create service' };
  }
}

export async function updateService(id: string, formData: Partial<Service>): Promise<ActionResult<Service>> {
  try {
    const docRef = doc(db, 'services', id);
    const now = new Date().toISOString();
    const updates = {
      ...formData,
      updatedAt: now,
      updated_at: now,
    };

    await updateDoc(docRef, updates);
    const d = await getDoc(docRef);
    const service = normalizeService(id, d.data());

    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, data: service, message: 'Service updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update service' };
  }
}

export async function deleteService(id: string): Promise<ActionResult<void>> {
  try {
    await deleteDoc(doc(db, 'services', id));
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true, data: undefined, message: 'Service deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete service' };
  }
}
