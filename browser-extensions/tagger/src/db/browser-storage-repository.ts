import { Repository } from './repository';

export default class BrowserStorageRepository extends Repository {
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  get(key: string): Promise<unknown[]> {
    return browser.storage.local.get(key).then((results) => {
      return results[key] || [];
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
