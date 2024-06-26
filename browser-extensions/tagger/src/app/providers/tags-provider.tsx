import { TagType } from '../../schemas/tag-schemas';
import { tagModel } from '../models';
import { BaseArrayDispatch, generateBaseArrayProvider } from './base-provider';

export const {
  provider: TagsProvider,
  useArrayData: useTagsData,
  useArrayDispatch: useTagsDispatch,
} = generateBaseArrayProvider(tagModel);

export type TagDispatch = BaseArrayDispatch<TagType>;
