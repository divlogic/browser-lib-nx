import browser from 'webextension-polyfill';
import { Repository } from './repository';

type HasId = unknown & {
  id: number;
};
export default class BrowserStorageRepository extends Repository {
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  async get<T>(key: string): Promise<T[]> {
    const results = await browser.storage.local.get(key);
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
    items.map((item: { [key: string]: unknown }, index: number) => {
      item.id = index;
      return item;
    });
    return items;
  }

  getAll(key: string): Promise<unknown[]> {
    return browser.storage.local.get(key).then((results) => {
      return results[key] || [];
    });
  }

  async set(key: string, values: unknown[]): Promise<void> {
    const response = browser.storage.local.set({ [key]: values });
    return response;
  }

  add(key: string, item: unknown) {
    return this.get(key).then((items) => {
      if (typeof items === 'undefined') {
        items = [];
      }
      if (typeof item === 'object' && item != null) {
        (item as HasId).id = items.length;
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

  update<T>(key: string, item: T & { id: number }): Promise<void> {
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
