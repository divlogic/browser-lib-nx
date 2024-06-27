import { Engine } from '@browser-lib-nx/db';
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
      await Engine.createStore(this.config.dbName, this.config.storeName);
      return;
    }
  }

  get<T>(key: string): Promise<T[] | null> {
    return Engine.getAll<T>(this.config.dbName, this.config.storeName);
  }

  getAll() {
    const items = Engine.getAll(this.config.dbName, this.config.storeName);

    return items;
  }

  async update<T>(key: string, item: T): Promise<IDBValidKey | undefined> {
    const request = await Engine.put(
      this.config.dbName,
      this.config.storeName,
      item
    );
    return request;
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

  async set(key: string, values: unknown[]): Promise<void> {
    throw new Error('Function not implemented yet.');
  }
}
