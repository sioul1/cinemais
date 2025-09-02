import { z } from 'zod';

export const createMediaSchema = z.object({
  title: z
    .string()
    .min(1)
    .describe('O título do filme ou série. Ex: "Matrix Genérica"'),
  description: z
    .string()
    .min(1)
    .describe(
      'A descrição do filme ou série. Ex: "Um dev descobre que o mundo é uma simulação e precisa debugá-lo."',
    ),
  type: z
    .enum(['movie', 'series'])
    .describe('O tipo da mídia, deve ser "movie" ou "series". Ex: "movie"'),
  releaseYear: z
    .number()
    .int()
    .min(1900)
    .describe('O ano de lançamento do filme ou série. Ex: 2025'),
  genre: z
    .string()
    .min(1)
    .describe('O gênero do filme ou série. Ex: "Ficção Científica"'),
});

export type CreateMediaDto = z.infer<typeof createMediaSchema>;
