import { StoreModel } from '../../db/store-model';
import { HighlightStyle } from '../../schemas';
export class StyleModel extends StoreModel<HighlightStyle> {
  ['constructor']!: typeof StyleModel & typeof StoreModel;
  public static key = 'styles';
}

export const styleModel = new StyleModel();
