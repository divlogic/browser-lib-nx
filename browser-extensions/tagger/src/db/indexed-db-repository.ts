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

  /**
   * Sets whatever the existing values are to the new values.
   *
   * @param key - Kept to maintain API consistency, but this is used earlier as the store name
   * @param values
   * @returns
   */
  async set(key: string, values: T[]): Promise<void> {
    await Engine.put(this.config.dbName, this.config.storeName, values);
    return;
  }

  add(key: string, item: T) {
    const model = new Engine<T>(key);
    return model.add(item);
  }

  remove(key: string, index: number) {
    return Engine.delete(this.config.dbName, this.config.storeName, index);
  }

  clear() {
    const model = new Engine<T>(key);
    return model.deleteStore();
  }
}

export { IndexedDBRepository as Repo };
