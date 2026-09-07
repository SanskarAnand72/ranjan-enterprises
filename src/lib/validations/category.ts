import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
  meta_title: z.string().max(60).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
