import { z } from 'zod';
import { HighlightSchema } from './style-schemas';

export const TagSchema = z.object({
  id: z.number(),
  text: z.string(),
  style_name: z.string(),
  style: HighlightSchema.optional(),
});

export const UnsavedTagSchema = TagSchema.omit({ id: true });

export type TagType = z.infer<typeof TagSchema>;

export type UnsavedTagType = z.infer<typeof TagSchema>;
