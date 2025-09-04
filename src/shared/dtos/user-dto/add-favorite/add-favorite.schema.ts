import { z } from 'zod';

export const addFavoriteSchema = z.object({
  mediaId: z.string().cuid('O mediaId deve ser um CUID válido.'),
});

export type AddFavoriteDto = z.infer<typeof addFavoriteSchema>;
