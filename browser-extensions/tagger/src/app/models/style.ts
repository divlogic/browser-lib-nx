import { StoreModel } from '../../db/store-model';
import { HighlightStyle, UnsavedHighlight } from '../../schemas';
export class Style extends StoreModel<HighlightStyle> {
  ['constructor']!: typeof Style & typeof StoreModel;
  public static key = 'styles';
}

export const defaultStyle: UnsavedHighlight = {
  name: 'default',
  color: 'black',
  backgroundColor: 'yellow',
};
export const styleModel = new Style();
