import { Repository } from './repository';

export abstract class StoreModel<T> {
  private static repositoryCache: Repository;
  abstract key: string;

  constructor(repository: Repository) {
    if (typeof repository !== 'undefined') {
      StoreModel.repositoryCache = repository;
    }
  }

  get repository() {
    return StoreModel.repositoryCache;
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
