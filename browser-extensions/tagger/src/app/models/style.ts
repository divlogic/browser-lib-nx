import { StoreModel } from '../../db/store-model';
import { HighlightStyle } from '../../schemas';
export class StyleModel extends StoreModel<HighlightStyle> {
  key = 'styles';
}

export const styleModel = new StyleModel();
