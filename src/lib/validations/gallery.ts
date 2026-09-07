import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;
