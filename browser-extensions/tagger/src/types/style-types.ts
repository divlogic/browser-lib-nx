import { z } from 'zod';

export const HighlightSchema = z
  .object({
    color: z.string(),
    backgroundColor: z.string(),
  })
  .and(
    z
      .object({
        textDecoration: z.string().optional(),
        textShadow: z.string().optional(),
      })
      .or(
        z.object({
          textDecorationColor: z.string().optional(),
          textDecorationLine: z.string().optional(),
          textDecorationStyle: z.string().optional(),
          textDecorationThickness: z.string().optional(),
        })
      )
  );
