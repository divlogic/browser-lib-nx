import { Repository } from '../db';
import browser from 'webextension-polyfill';
export class BrowserStorageRepository<T> extends Repository<T> {
  get(key: string): Promise<T[]> {
    return browser.storage.local.get(key).then((results) => {
      return results[key];
    });
  }
  set(key: string, values: T[]) {
    return browser.storage.local.set({ [key]: values });
  }

  add(key: string, item: T) {
    return this.get(key).then((items) => {
      return this.set(key, [...items, item]);
    });
  }

  remove(key: string, index: number) {
    return this.get(key).then((items) => {
      items.splice(index, 1);
      return this.set(key, items);
    });
  }

  clear() {
    return browser.storage.local.clear();
  }
}

export { BrowserStorageRepository as Repository };
