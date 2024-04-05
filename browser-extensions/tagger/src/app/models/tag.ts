import { StoreModel } from '../../db';
import { TagType } from '../form-reducer';
export class TagModel extends StoreModel<TagType> {
  key = 'tags';
}

export const tag = new TagModel();
