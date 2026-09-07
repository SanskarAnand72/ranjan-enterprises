'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { settingsSchema, homepageContentSchema } from '@/lib/validations/settings';
import type { ActionResult, WebsiteSetting, HomepageContent, SiteSettings } from '@/types';

export async function getSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    business_name: 'Ranjan Enterprises',
    business_tagline: 'Premium Wooden Works & Custom Woodwork',
    phone: '8859123538',
    whatsapp: '918859123538',
    email: 'info@ranjanenterprises.com',
    address: 'Workshop Area, Industrial Zone, New Delhi, India',
    google_maps_url: '',
    logo_url: '',
    favicon_url: '',
    working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    footer_about: 'Crafting timeless wood furniture with precision, passion, and elegance.',
    seo_title: 'Ranjan Enterprises — Handcrafted Wooden Excellence',
    seo_description: 'Custom handcrafted wooden furniture, doors, frames, and interior woodworking.',
  };

  try {
    // Primary lookup: website_settings collection
    const docRef = doc(db, 'website_settings', 'general');
    let snapshot = await getDoc(docRef);
    
    // Fallback lookup: settings collection
    if (!snapshot.exists()) {
      const fallbackRef = doc(db, 'settings', 'general');
      snapshot = await getDoc(fallbackRef);
    }

    if (!snapshot.exists()) return defaults;
    const data = snapshot.data() || {};
    
    return {
      ...defaults,
      business_name: data.companyName || data.business_name || defaults.business_name,
      phone: data.phone || defaults.phone,
      email: data.email || defaults.email,
      address: data.address || defaults.address,
      whatsapp: data.whatsapp || defaults.whatsapp,
      logo_url: data.logo_url || defaults.logo_url,
      google_maps_url: data.google_maps_url || defaults.google_maps_url,
      working_hours: data.working_hours || defaults.working_hours,
      business_tagline: data.business_tagline || defaults.business_tagline,
      footer_about: data.footer_about || defaults.footer_about,
      seo_title: data.seo_title || defaults.seo_title,
      seo_description: data.seo_description || defaults.seo_description,
    };
  } catch (error) {
    console.error('Error fetching settings from Firestore:', error);
    return defaults;
  }
}

export async function getAllSettings(): Promise<WebsiteSetting[]> {
  try {
    const settings = await getSettings();
    return Object.entries(settings).map(([key, value]) => ({
      id: key,
      key,
      value: value || '',
      value_json: null,
      label: key.replace(/_/g, ' ').toUpperCase(),
      description: null,
      setting_type: 'text',
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    return [];
  }
}

export async function updateSettings(
  formData: Record<string, string>
): Promise<ActionResult<void>> {
  const parsed = settingsSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid settings data',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const now = new Date().toISOString();
    
    const payload = {
      ...parsed.data,
      companyName: parsed.data.business_name || 'Ranjan Enterprises',
      phone: parsed.data.phone || '',
      email: parsed.data.email || '',
      address: parsed.data.address || '',
      updatedAt: now,
      updated_at: now,
    };

    const batch = writeBatch(db);
    batch.set(doc(db, 'website_settings', 'general'), payload, { merge: true });
    batch.set(doc(db, 'settings', 'general'), payload, { merge: true });
    await batch.commit();

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    return { success: true, data: undefined, message: 'Settings updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update settings' };
  }
}

export async function getHomepageContent(): Promise<HomepageContent[]> {
  try {
    const snapshot = await getDocs(collection(db, 'homepage_content'));
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => ({
      id: d.id,
      section: d.data().section || d.id,
      title: d.data().title || null,
      subtitle: d.data().subtitle || null,
      description: d.data().description || null,
      content_json: d.data().content_json || null,
      is_visible: d.data().is_visible ?? true,
      display_order: d.data().display_order || 0,
      created_at: d.data().created_at || new Date().toISOString(),
      updated_at: d.data().updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    return [];
  }
}

export async function getHomepageSection(section: string): Promise<HomepageContent | null> {
  try {
    const docRef = doc(db, 'homepage_content', section);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      id: snapshot.id,
      section,
      title: data?.title || null,
      subtitle: data?.subtitle || null,
      description: data?.description || null,
      content_json: data?.content_json || null,
      is_visible: data?.is_visible ?? true,
      display_order: data?.display_order || 0,
      created_at: data?.created_at || new Date().toISOString(),
      updated_at: data?.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

export async function updateHomepageSection(
  section: string,
  formData: Partial<HomepageContent>
): Promise<ActionResult<void>> {
  const parsed = homepageContentSchema.safeParse({ ...formData, section });
  if (!parsed.success) {
    return { success: false, error: 'Invalid content data' };
  }

  try {
    const now = new Date().toISOString();
    const docRef = doc(db, 'homepage_content', section);
    await setDoc(docRef, {
      ...parsed.data,
      updated_at: now,
    }, { merge: true });

    revalidatePath('/');
    return { success: true, data: undefined, message: 'Content updated successfully' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
