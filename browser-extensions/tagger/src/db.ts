async function importRepository() {
  if (true) {
    return (await import('./db/indexed-db-repository')).Repo;
  }
}

export abstract class Repository<T> {
  public abstract initialize(): Promise<void>;
  public config: unknown;
  constructor(config: unknown = {}) {
    this.config = config;
  }
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

  get repository() {
    return (async () => {
      const repository = await this.importedRepository;
      const repositoryInstance = new repository({
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

    return repo.set({ [this.key]: values });
  }

  async add(item: T) {
    return this.get().then((items) => {
      return this.set([...items, item]);
    });
  }
  async remove(index: number) {
    return this.get().then((items) => {
      items.splice(index, 1);
      return this.set(items);
    });
  }

  // clear() {
  //   return browser.storage.local.clear();
  // }
}
