import { z } from 'zod';
import { HighlightSchema } from './style-schemas';

export const TagSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  style: HighlightSchema.or(z.string()),
});

export type TagType = z.infer<typeof TagSchema>;
