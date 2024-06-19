import { StoreModel } from '../../db/store-model';
import { TagType } from '../tags-reducer';
export class TagModel extends StoreModel<TagType> {
  public static key = 'tags';
  ['constructor']!: typeof TagModel & typeof StoreModel;
}

export const tag = new TagModel();
