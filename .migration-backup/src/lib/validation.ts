import { z } from 'zod';

export const querySchema = z.object({
  text: z.string().min(1).max(1000),
  userId: z.string().min(1),
  coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

export const contributionSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['photo', 'review', 'report', 'event']),
  coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
  territorio: z.string().min(1).max(50),
  payload: z.record(z.unknown()).optional(),
  poiId: z.string().optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5).nullable(),
  territory: z.string().min(1).max(50),
  consent: z.boolean().nullable(),
});

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
  return result.data;
}
