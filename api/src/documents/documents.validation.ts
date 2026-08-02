import { z } from 'zod';

export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  level: z.string().optional(),
  session: z.string().optional(),
  unit: z.enum(['academic', 'bursary', 'department']),
});

export const reviewDocumentSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().min(1).optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ReviewDocumentInput = z.infer<typeof reviewDocumentSchema>;
