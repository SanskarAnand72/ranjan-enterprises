import { z } from 'zod';

export const settingsSchema = z.object({
  business_name: z.string().min(1, 'Business name is required').max(100),
  business_tagline: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  google_maps_url: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  working_hours: z.string().max(300).optional(),
  facebook_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  footer_about: z.string().max(1000).optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
});

export const homepageContentSchema = z.object({
  section: z.string(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content_json: z.record(z.string(), z.unknown()).optional().nullable(),
  is_visible: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
export type HomepageContentFormData = z.infer<typeof homepageContentSchema>;
