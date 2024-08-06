import { TagSchema, TagType } from '../../schemas/tag-schemas';
import { tagModel } from '../models';
import { BaseArrayDispatch, generateBaseArrayProvider } from './base-provider';

export const {
  provider: TagsProvider,
  useArrayData: useTagsData,
  useArrayDispatch: useTagsDispatch,
  useModelActions: useTagActions,
} = generateBaseArrayProvider(tagModel, TagSchema);

export type TagDispatch = BaseArrayDispatch<TagType>;
