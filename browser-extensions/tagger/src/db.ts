import { BrowserStorageRepository } from './db/browser-storage-repository';
import { IndexedDBRepository } from './db/indexed-db-repository';

async function importRepository() {
  if (import.meta.env.DEV) {
    return (await import('./db/indexed-db-repository')).Repository;
  } else {
    return (await import('./db/browser-storage-repository')).Repository;
  }
}

export abstract class Repository<T> {
  public abstract initialize(): Promise<void>;
  public config: unknown;
  constructor(config: unknown): void;
  public abstract get(key: string): Promise<T[] | null>;
  public abstract getAll(): Promise<T[] | null>;
  public abstract set(key: string, values: T[]): Promise<void>;
  public abstract add(key: string, item: T): Promise<void>;
  public abstract remove(key: string, index: number): Promise<void>;
  /**
   * TODO
   *  clear method
   */
  // public abstract clear(): Promise<void>;
}

export abstract class StoreModel<T> {
  abstract key: string;
  storageArea: string;
  importedRepository: Promise<typeof Repository<T>> | Repository<T>;

  constructor(props: { storageArea: string } = { storageArea: 'local' }) {
    this.storageArea = props.storageArea;
    this.importedRepository = importRepository();
  }

  get repository(): IndexedDBRepository<T> | BrowserStorageRepository<t> {
    return (async (): Promise<new () => Repository<T>> => {
      const repository = await this.importedRepository;
      const repositoryInstance = new repository<T>({
        dbName: 'tagger',
        storeName: 'tags',
      });
      await repositoryInstance.initialize();
      return repositoryInstance;
    })();
  }

  async get(): Promise<T[]> {
    const repo = await this.repository;
    const items = repo.getAll();

    return repo.getAll();
  }

  async set(values: T[]) {
    const repo = await this.repository;

    return repo.set(this.key, values);
  }

  async add(item: T) {
    const repo = await this.repository;
    return await repo.add(this.key, item);
  }

  async remove(index: number) {
    const repo = await this.repository;
    await repo.remove(this.key, index);
    return;
  }

  // clear() {
  //   return browser.storage.local.clear();
  // }
}
