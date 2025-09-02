import { z } from 'zod';

export const addFavoriteSchema = z.object({
  mediaId: z
    .string()
    .uuid()
    .describe(
      'O ID da mídia (filme ou série) a ser adicionada aos favoritos. Ex: "uuid-do-filme-ou-serie"',
    ),
});

export type AddFavoriteDto = z.infer<typeof addFavoriteSchema>;
