import { z } from 'zod';

// Example shared type definitions

// User schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(100),
  email: z.string().email(),
  is_active: z.boolean().default(true),
  date_joined: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const PaginatedResponseSchema = ApiResponseSchema.extend({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.any()),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginatedResponse<T> = Omit<z.infer<typeof PaginatedResponseSchema>, 'results'> & {
  results: T[];
};

// Add your shared types here
