import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['student', 'superAdmin', 'academic', 'bursary', 'department']),
  studentId: z.string().optional(),
  staffId: z.string().optional(),
  departmentId: z.string().nullable().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  role: z.enum(['student', 'superAdmin', 'academic', 'bursary', 'department']).optional(),
  studentId: z.string().optional(),
  staffId: z.string().optional(),
  departmentId: z.string().nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
