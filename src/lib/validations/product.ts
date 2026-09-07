import { z } from 'zod';

export const specificationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  product_id: z.string().optional(),
  public_id: z.string().optional().nullable(),
  storage_path: z.string().optional().nullable(),
  url: z.string(),
  secure_url: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  is_cover: z.boolean().default(false),
  display_order: z.number().default(0),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, hyphens only)'),
  sku: z.string().max(100).optional().nullable(),
  category_id: z.string().optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  original_price: z.coerce.number().min(0).optional().nullable(),
  discount_percentage: z.coerce.number().min(0).max(100).optional().nullable(),
  price_label: z.string().max(100).optional().nullable(),
  description: z.string().optional().nullable(),
  short_description: z.string().max(1000).optional().nullable(),
  
  // Wood & Material details
  wood_type: z.string().optional().nullable(),
  wood_types: z.array(z.string()).default([]),
  material_type: z.string().optional().nullable(),
  finish_type: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  thickness: z.string().optional().nullable(),
  durability_info: z.string().optional().nullable(),
  warranty_info: z.string().optional().nullable(),

  // Dimensions & Weight
  dimensions: z.string().optional().nullable(),
  height: z.string().optional().nullable(),
  width: z.string().optional().nullable(),
  length: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),

  specifications: z.array(specificationSchema).default([]),
  images: z.array(productImageSchema).default([]),
  available_sizes: z.array(z.string()).default([]),
  customization_options: z.string().optional().nullable(),
  delivery_time: z.string().max(100).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived', 'hidden']).default('published'),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'made_to_order', 'discontinued']).default('in_stock'),
  in_stock: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  video_url: z.string().url().optional().nullable().or(z.literal('')),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(300).optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;
