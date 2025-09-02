import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1).describe('O nome do usuário. Ex: "João Silva"'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
