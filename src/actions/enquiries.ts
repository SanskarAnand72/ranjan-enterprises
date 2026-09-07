'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { enquirySchema, updateEnquirySchema } from '@/lib/validations/enquiry';
import type { ActionResult, Enquiry, PaginatedResult, EnquiryFilters } from '@/types';
import { headers } from 'next/headers';

function normalizeEnquiry(id: string, data: any): Enquiry {
  return {
    id,
    name: data.name || '',
    email: data.email || null,
    phone: data.phone || '',
    product_category: data.product_category || null,
    message: data.message || '',
    product_id: data.product_id || null,
    product_name: data.product_name || null,
    status: data.status || 'new',
    admin_notes: data.admin_notes || null,
    source: data.source || 'website',
    ip_address: data.ip_address || null,
    created_at: data.createdAt || data.created_at || new Date().toISOString(),
    updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
  };
}

export async function submitEnquiry(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = enquirySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      null;

    const docRef = doc(collection(db, 'enquiries'));
    const now = new Date().toISOString();

    const payload = {
      id: docRef.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message,
      product_id: parsed.data.product_id || null,
      product_name: parsed.data.product_name || null,
      product_category: parsed.data.product_category || null,
      status: 'new',
      source: 'website',
      ip_address: ip,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(docRef, payload);

    revalidatePath('/admin/enquiries');
    return {
      success: true,
      data: { id: docRef.id },
      message: 'Thank you! Your enquiry has been received. We will contact you within 24 hours.',
    };
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    return {
      success: false,
      error: 'Failed to submit enquiry. Please try again.',
    };
  }
}

export async function getEnquiries(
  filters: EnquiryFilters = {}
): Promise<PaginatedResult<Enquiry>> {
  try {
    const { search, status, page = 1, pageSize = 20 } = filters;

    const snapshot = await getDocs(collection(db, 'enquiries'));
    let enquiries: Enquiry[] = snapshot.docs.map(d => normalizeEnquiry(d.id, d.data()));

    if (search) {
      const q = search.toLowerCase();
      enquiries = enquiries.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          e.message.toLowerCase().includes(q)
      );
    }

    if (status) {
      enquiries = enquiries.filter(e => e.status === status);
    }

    // Sort newest first
    enquiries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = enquiries.length;
    const from = (page - 1) * pageSize;
    const paginated = enquiries.slice(from, from + pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (error) {
    console.error('Error getting enquiries:', error);
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }
}

export async function updateEnquiry(
  id: string,
  formData: unknown
): Promise<ActionResult<Enquiry>> {
  const parsed = updateEnquirySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed' };
  }

  try {
    const docRef = doc(db, 'enquiries', id);
    const now = new Date().toISOString();
    await updateDoc(docRef, {
      ...parsed.data,
      updatedAt: now,
      updated_at: now,
    });

    const updated = await getDoc(docRef);
    const enquiry = normalizeEnquiry(id, updated.data());

    revalidatePath('/admin/enquiries');
    return { success: true, data: enquiry, message: 'Enquiry updated' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteEnquiry(id: string): Promise<ActionResult<void>> {
  try {
    await deleteDoc(doc(db, 'enquiries', id));
    revalidatePath('/admin/enquiries');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getEnquiryStats(): Promise<{
  total: number;
  new: number;
  in_progress: number;
  completed: number;
}> {
  try {
    const snapshot = await getDocs(collection(db, 'enquiries'));
    const stats = { total: 0, new: 0, in_progress: 0, completed: 0 };

    snapshot.forEach(d => {
      const status = d.data().status;
      stats.total++;
      if (status === 'new') stats.new++;
      else if (status === 'in_progress') stats.in_progress++;
      else if (status === 'completed') stats.completed++;
    });

    return stats;
  } catch (error) {
    return { total: 0, new: 0, in_progress: 0, completed: 0 };
  }
}
