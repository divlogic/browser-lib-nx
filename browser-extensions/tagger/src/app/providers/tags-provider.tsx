import { Tag } from '../models';
import { generateBaseArrayProvider } from './base-provider';

export const {
  provider: TagsProvider,
  itemContext: TagsContext,
  dispatchContext: TagsDispatch,
} = generateBaseArrayProvider(Tag);
