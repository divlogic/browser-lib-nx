import browser, { Storage } from 'webextension-polyfill';
import { TagType } from './app/form-reducer';

export abstract class StoreModel<T> {
  abstract key: string;
  storageArea: string;

  constructor(props: { storageArea: string } = { storageArea: 'local' }) {
    this.storageArea = props.storageArea;
  }

  get(): Promise<T[]> {
    return browser.storage.local.get(this.key).then((results) => {
      return results[this.key];
    });
  }

  set(values: T[]) {
    return browser.storage.local
      .set({ [this.key]: values })
      .then((testSet) => {
        console.log('Ok: ', values, ' set');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  add(item: T) {
    return this.get().then((items) => {
      return this.set([...items, item]);
    });
  }
}

export class TagModel extends StoreModel<TagType> {
  key = 'tags';
}

export const tag = new TagModel();
