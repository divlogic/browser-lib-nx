import { Engine } from '@browser-lib-nx/index';
import { Repository } from './repository';

export default class IndexedDBRepository extends Repository {
  config: { dbName: string; storeName: string };

  constructor(config: { dbName: string; storeName: string }) {
    super(config);
    this.config = config;
  }

  public async initialize(): Promise<void> {
    const db = await Engine.getDB(this.config.dbName);
    if (db.objectStoreNames.contains(this.config.storeName)) {
      return;
    } else {
      db.close();
      const store = await Engine.createStore(
        this.config.dbName,
        this.config.storeName
      );
      return;
    }
  }

  get(key: string): Promise<unknown[] | null> {
    return Engine.getAll(this.config.dbName, this.config.storeName);
  }

  getAll() {
    const items = Engine.getAll(this.config.dbName, this.config.storeName);

    return items;
  }

  async update<T>(key: string, item: T): Promise<T> {
    const request = await Engine.put(
      this.config.dbName,
      this.config.storeName,
      item
    );
    return request;
  }

  /**
   * Sets whatever the existing values are to the new values.
   *
   * @param key - Kept to maintain API consistency, but this is used earlier as the store name
   * @param values
   * @returns
   */
  async set(key: string, values: unknown[]): Promise<void> {
    await Engine.put(this.config.dbName, this.config.storeName, values);
    return;
  }

  async add(key: string, item: unknown): Promise<unknown> {
    const result = await Engine.add(
      this.config.dbName,
      this.config.storeName,
      item
    );
    return result;
  }

  async remove(key: string, index: number) {
    await Engine.delete(this.config.dbName, this.config.storeName, index);
    return;
  }
}
