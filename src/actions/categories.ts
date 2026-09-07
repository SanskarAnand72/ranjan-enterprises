'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, limit, writeBatch } from 'firebase/firestore';
import { categorySchema } from '@/lib/validations/category';
import type { ActionResult, Category } from '@/types';
import { slugify } from '@/lib/utils';

function normalizeCategory(id: string, data: any): Category {
  return {
    id,
    name: data.name || '',
    slug: data.slug || slugify(data.name || id),
    description: data.description || null,
    icon: data.icon || null,
    image_url: data.image_url || data.imageUrl || null,
    is_active: data.is_active ?? true,
    display_order: typeof data.display_order === 'number' ? data.display_order : 0,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    created_at: data.createdAt || data.created_at || new Date().toISOString(),
    updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
  };
}

export async function getCategories(activeOnly = true): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    let list: Category[] = snapshot.docs.map(d => normalizeCategory(d.id, d.data()));

    if (activeOnly) {
      list = list.filter(c => c.is_active);
    }

    list.sort((a, b) => a.display_order - b.display_order);
    return list;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const q = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return normalizeCategory(d.id, d.data());
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
}

export async function createCategory(formData: unknown): Promise<ActionResult<Category>> {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const slug = parsed.data.slug || slugify(parsed.data.name);
    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const existing = await getDocs(q);
    if (!existing.empty) {
      return { success: false, error: 'A category with this slug already exists.' };
    }

    const docRef = doc(collection(db, 'categories'));
    const now = new Date().toISOString();
    const payload = {
      id: docRef.id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
      image_url: parsed.data.image_url || null,
      is_active: parsed.data.is_active ?? true,
      display_order: parsed.data.display_order ?? 0,
      createdAt: now,
      created_at: now,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(docRef, payload);
    const category = normalizeCategory(docRef.id, payload);

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: category, message: 'Category created successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create category' };
  }
}

export async function updateCategory(id: string, formData: unknown): Promise<ActionResult<Category>> {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const docRef = doc(db, 'categories', id);
    const now = new Date().toISOString();
    const updates = {
      name: parsed.data.name,
      slug: parsed.data.slug || slugify(parsed.data.name),
      description: parsed.data.description || null,
      icon: parsed.data.icon || null,
      image_url: parsed.data.image_url || null,
      is_active: parsed.data.is_active ?? true,
      display_order: parsed.data.display_order ?? 0,
      updatedAt: now,
      updated_at: now,
    };

    await updateDoc(docRef, updates);
    const updated = await getDoc(docRef);
    const category = normalizeCategory(id, updated.data());

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: category, message: 'Category updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update category' };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<void>> {
  try {
    const q = query(collection(db, 'products'), where('category_id', '==', id));
    const productsSnapshot = await getDocs(q);
    if (!productsSnapshot.empty) {
      return {
        success: false,
        error: `Cannot delete: ${productsSnapshot.size} product(s) use this category. Please reassign them first.`,
      };
    }

    await deleteDoc(doc(db, 'categories', id));

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: undefined, message: 'Category deleted successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete category' };
  }
}

export async function reorderCategories(ids: string[]): Promise<ActionResult<void>> {
  try {
    const batch = writeBatch(db);
    ids.forEach((id, index) => {
      const docRef = doc(db, 'categories', id);
      batch.update(docRef, { display_order: index });
    });
    await batch.commit();

    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
