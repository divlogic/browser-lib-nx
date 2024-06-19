import { Repository } from './repository';

export abstract class StoreModel<T> {
  protected static repositoryCache: Repository;
  public static key: string;
  ['constructor']!: typeof StoreModel;

  /**
   *
   * @param repository Only necessary the first time class is instantiated
   */
  constructor(repository?: Repository) {
    if (typeof repository !== 'undefined') {
      this.constructor.repositoryCache = repository;
    }
  }

  get key() {
    return this.constructor.key;
  }

  get repository() {
    return this.constructor.repositoryCache;
  }

  async get(): Promise<T[] | null> {
    return this.repository.get(this.key);
  }

  async update(item: T): Promise<void> {
    await this.repository.update(this.key, item);
    return;
  }

  async set(values: T[]) {
    return this.repository.set(this.key, values);
  }

  async add(item: T) {
    return await this.repository.add(this.key, item);
  }

  async remove(index: number) {
    await this.repository.remove(this.key, index);
    return;
  }
}
