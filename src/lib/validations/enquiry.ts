import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email').optional().nullable().or(z.literal('')),
  phone: z.string().min(10, 'Enter a valid phone number').max(20),
  product_category: z.string().max(100).optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  product_id: z.string().uuid().optional().nullable(),
  product_name: z.string().max(200).optional().nullable(),
});

export const updateEnquirySchema = z.object({
  status: z.enum(['new', 'in_progress', 'completed', 'spam']),
  admin_notes: z.string().max(2000).optional().nullable(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
export type UpdateEnquiryFormData = z.infer<typeof updateEnquirySchema>;
