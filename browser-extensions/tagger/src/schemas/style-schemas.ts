import { z } from 'zod';

export const TextDecorationLineSchema = z.optional(
  z.array(z.literal('none')).or(
    z
      .array(
        z
          .literal('underline')
          .or(z.literal('overline'))
          .or(z.literal('line-through'))
      )
      .refine((items) => new Set(items).size === items.length, {
        message: 'must be an array of unique strings',
      })
  )
);

export const HighlightCommon = z.object({
  name: z
    .string()
    .regex(
      /^[-_a-zA-Z0-9]+$/,
      'The style name must be limited to letters, numbers, underscores and hyphens.'
    ),
  color: z.string().optional(),
  backgroundColor: z.string(),
  textShadow: z.string().optional(),
});

export const TextDecorationStyleSchema = z
  .literal('solid')
  .or(z.literal('double'))
  .or(z.literal('dotted'))
  .or(z.literal('dashed'))
  .or(z.literal('wavy'))
  .or(z.literal(''))
  .optional();

export type TextDecorationStyle = z.infer<typeof TextDecorationStyleSchema>;

export const HighlightGranular = HighlightCommon.extend({
  textDecorationColor: z.string().optional(),
  textDecorationLine: TextDecorationLineSchema,
  textDecorationStyle: TextDecorationStyleSchema,
  textDecorationThickness: z.string().optional(),
});

export type HighlightGranularStyle = z.infer<typeof HighlightGranular>;

export const StyleFormSchema = HighlightGranular;

export type StyleFormFields = z.infer<typeof StyleFormSchema>;

export const HighlightShorthand = HighlightCommon.merge(
  z.object({
    textDecoration: z.string().optional(),
  })
);

export const HighlightSchema =
  HighlightGranular.or(HighlightShorthand).or(HighlightCommon);

export type HighlightStyle = z.infer<typeof HighlightSchema>;
