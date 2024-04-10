import { z } from 'zod';

export const createScheme = z.object({
    postId: z.string(),
    // reaction: z.string(),
});
