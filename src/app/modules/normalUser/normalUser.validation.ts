import { z } from 'zod';

const updateNormalUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
    isBlocked: z.boolean().optional(),
    isActive: z.boolean().optional(),
    // Add other fields as necessary
  }),
});

export const normalUserValidation = {
  updateNormalUserValidationSchema,
};
