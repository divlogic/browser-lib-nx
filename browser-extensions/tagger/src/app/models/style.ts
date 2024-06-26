import { StoreModel } from '../../db/store-model';
import { HighlightStyle } from '../../schemas';
export class Style extends StoreModel<HighlightStyle> {
  ['constructor']!: typeof Style & typeof StoreModel;
  public static key = 'styles';
}

export const styleModel = new Style();
