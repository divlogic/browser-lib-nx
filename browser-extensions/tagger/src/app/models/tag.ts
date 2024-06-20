import { StoreModel } from '../../db/store-model';
import { TagType } from '../../schemas/tag-schemas';
export class TagModel extends StoreModel<TagType> {
  public static key = 'tags';
  ['constructor']!: typeof TagModel & typeof StoreModel;
}

export const tag = new TagModel();
