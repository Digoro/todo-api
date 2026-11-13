import { z } from 'zod';
import { TASK_STATUSES } from '../task.interface.js';

export const findTasksQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
});

export type FindTasksQueryDto = z.infer<typeof findTasksQuerySchema>;
