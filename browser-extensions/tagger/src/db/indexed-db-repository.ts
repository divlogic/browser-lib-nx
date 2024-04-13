import { Engine } from '@browser-lib-nx/index';
import { Repository } from '../db';

export class IndexedDBRepository<T> extends Repository<T> {
  config: { dbName: string; storeName: string };

  constructor(config: { dbName: string; storeName: string }) {
    super();
    this.config = config;
  }

  public async initialize(): Promise<void> {
    const db = await Engine.getDB(this.config.dbName);
    if (db.objectStoreNames.contains(this.config.storeName)) {
      console.log('Contains');
    } else {
      db.close();
      const store = await Engine.createStore(
        this.config.dbName,
        this.config.storeName
      );
    }
  }

  get(key: string): Promise<T[] | null> {
    return Engine.getAll(this.config.dbName, this.config.storeName);
  }

  getAll() {
    const items = Engine.getAll(this.config.dbName, this.config.storeName);

    return items;
  }
  set(key: string, values: T[]) {
    const model = new Engine<T>(key);
    return model.put(values, key);
  }

  add(key: string, item: T) {
    const model = new Engine<T>(key);
    return model.add(item);
  }

  remove(key: string, index: number) {
    const model = new Engine<T>(key);
    return model.delete(index);
  }

  clear() {
    const model = new Engine<T>(key);
    return model.deleteStore();
  }
}

export { IndexedDBRepository as Repo };
