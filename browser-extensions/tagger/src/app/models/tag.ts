import { StoreModel } from '../../db/store-model';
import { HighlightStyle } from '../../schemas';
import { TagType } from '../../schemas/tag-schemas';
import { styleModel } from './style';
export class Tag extends StoreModel<TagType> {
  public static key = 'tag';
  ['constructor']!: typeof Tag & typeof StoreModel;

  async getWithStyle(): Promise<Tag[]> {
    const tags = await this.get();
    console.log('tags from getWithStyle:', tags);

    const styles: { [key: string]: HighlightStyle } = {};
    (await styleModel.get())?.forEach((style) => {
      if (style.name) {
        styles[style.name] = style;
      }
    });
    const tagsWithStyle = tags?.map((tag) => {
      return (tag.style = styles[tag.style_name]);
    });
    return tagsWithStyle;
  }
}

export const tagModel = new Tag();
