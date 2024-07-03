import { z } from 'zod';

export const TagSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  style_name: z.string().min(1),
});

export const UnsavedTagSchema = TagSchema.omit({ id: true });

export type TagType = z.infer<typeof TagSchema>;

export type UnsavedTagType = z.infer<typeof TagSchema>;
