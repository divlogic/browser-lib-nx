import { Model } from '@browser-lib-nx/db';
export class Tag extends Model<{ id?: number; text: string }> {
  store = 'tags';
}
export const tag = new Tag();
