import { styleModel } from '../models';
import { HighlightStyle } from '../../schemas';
import { BaseArrayDispatch, generateBaseArrayProvider } from './base-provider';

export const {
  provider: StylesProvider,
  useArrayData: useStylesData,
  useArrayDispatch: useStylesDispatch,
} = generateBaseArrayProvider(styleModel);

export type StyleDispatch = BaseArrayDispatch<HighlightStyle>;
