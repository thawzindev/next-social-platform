import { z } from 'zod';

export const createScheme = z.object({
    name: z.string(),
    email: z.string().email(),
});
