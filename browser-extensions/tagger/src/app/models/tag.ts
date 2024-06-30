import { StoreModel } from '../../db/store-model';
import { TagType } from '../../schemas/tag-schemas';
export class Tag extends StoreModel<TagType> {
  public static key = 'tag';
  ['constructor']!: typeof Tag & typeof StoreModel;
}

export const tagModel = new Tag();
