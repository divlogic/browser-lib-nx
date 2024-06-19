import { StoreModel } from './store-model';

export async function RepositoryFactory(key: string) {
  let RepositoryClass;
  let config;
  let repository;
  if (import.meta.env.MODE === 'development') {
    RepositoryClass = (await import('./indexed-db-repository')).default;
    config = { dbName: 'tagger', storeName: key };
    repository = new RepositoryClass(config);
  } else {
    RepositoryClass = (await import('./browser-storage-repository')).default;
    repository = new RepositoryClass();
  }
  await repository.initialize();
  return repository;
}
