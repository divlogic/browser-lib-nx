export async function RepositoryFactory(key: string) {
  let RepositoryClass;
  let config;
  let repository;
  if (import.meta.env.MODE === 'development') {
    RepositoryClass = (await import('./indexed-db-repository')).default;
    /**
     * using key as dbName is a minor bugfix, but it's less than idea.
     * currently the indexeddb is having issues handling onblocked events
     * and this should allow the project to proceed without having to do a deep dive fix.
     * But it seems like it means not being able to leverage the indexed
     * aspect of "indexed"db.
     */
    config = { dbName: key, storeName: key };
    repository = new RepositoryClass(config);
  } else {
    RepositoryClass = (await import('./browser-storage-repository')).default;
    repository = new RepositoryClass();
  }
  await repository.initialize();
  return repository;
}
