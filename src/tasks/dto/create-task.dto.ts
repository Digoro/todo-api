import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
