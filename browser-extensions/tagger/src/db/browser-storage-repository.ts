import { TagType } from '../app/form-reducer';
import { Repository } from './repository';

export default class BrowserStorageRepository extends Repository {
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  get(key: string): Promise<unknown[]> {
    return browser.storage.local.get(key).then((results) => {
      const items = results[key] || [];
      /**
       * This doesn't look right.
       * It works because when deleting items, this maps to the visual order that it is in
       * But when adding items, the id is added
       * The id happens to just be the length of the array
       * So it works, but only because it's mapping to that visual array
       * and ONLY because it's appending and deleting.
       *
       * This logic would fall apart for editing values,
       * like say you wanted to change the color or
       * more options were added in as a feature.
       *
       * These repository classes need more work as an API.
       */
      items.map((item: TagType, index: number) => {
        item.id = index;
        return item;
      });
      return items;
    });
  }

  getAll(key: string): Promise<unknown[]> {
    return browser.storage.local.get(key).then((results) => {
      return results[key] || [];
    });
  }

  set(key: string, values: unknown[]) {
    return browser.storage.local.set({ [key]: values });
  }

  add(key: string, item: unknown) {
    return this.get(key).then((items) => {
      if (typeof items === 'undefined') {
        items = [];
      }
      if (typeof item === 'object' && item !== null) {
        item.id = items.length;
      }
      return this.set(key, [...items, item]);
    });
  }

  remove(key: string, index: number) {
    return this.get(key).then((items) => {
      items.splice(index, 1);
      return this.set(key, items);
    });
  }
  public update<T>(key: string, item: T): Promise<T> {
    return this.get(key).then((items) => {
      // update array of tags here by only updating the one.
      // assumes the key is always id.
      items[item.id] = item;
      return this.set(key, items);
    });
  }

  clear() {
    return browser.storage.local.clear();
  }
}
