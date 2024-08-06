import { styleModel } from '../models';
import { HighlightSchema, HighlightStyle } from '../../schemas';
import { BaseArrayDispatch, generateBaseArrayProvider } from './base-provider';
import { z } from 'zod';

export const {
  provider: StylesProvider,
  useArrayData: useStylesData,
  useArrayDispatch: useStylesDispatch,
  useModelActions: useStylesActions,
} = generateBaseArrayProvider<HighlightStyle, z.ZodTypeAny>(
  styleModel,
  HighlightSchema
);

export type StyleDispatch = BaseArrayDispatch<HighlightStyle>;
