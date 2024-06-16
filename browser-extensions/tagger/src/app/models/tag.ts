import { StoreModel } from '../../db/store-model';
import { TagType } from '../tags-reducer';
export class TagModel extends StoreModel<TagType> {
  key = 'tags';
}

export const tag = new TagModel();
