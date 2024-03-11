import { Logger, ILogObj } from 'tslog';
const log: Logger<ILogObj> = new Logger();
export abstract class Model<T> {
  abstract store: string;

  timeout = 3000;

  getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.store);
      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        log.info('onupgradeneeded');
        db.onclose = () => {
          log.info('db closed from getDB');
        };
        db.close();
        resolve(db);
      };
      request.onerror = (event) => {
        log.error('onerror', event);
        reject((event.target as IDBOpenDBRequest).error);
      };
      request.onblocked = (event) => {
        log.error('onblocked');
        reject(event);
      };
      request.onsuccess = (event) => {
        log.info('onsuccess');
        const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve(db);
      };
    });
  };

  storeNotSetError() {
    return new Error('Model requires store to be set.');
  }

  createStore(): Promise<IDBObjectStore> {
    log.info('creating the store');
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        this.getDB().then((db: IDBDatabase) => {
          if (!db.objectStoreNames.contains(this.store)) {
            db.onclose = (e) => {
              log.info('db is closed');
            };
            db.onabort = () => {
              log.info('db is aborted');
            };
            db.onerror = (e) => {
              log.error(e);
              reject(e);
            };
            db.close();
            const upgradedDBRequest = window.indexedDB.open(
              this.store,
              db.version + 1
            );
            upgradedDBRequest.onblocked = (event) => {
              // Database needs to acknowledge the request
              log.info('onblocked', event);
            };
            upgradedDBRequest.onupgradeneeded = (event) => {
              log.info('onupgradeneeded', event);
              const upgradeableDB = (event.target as IDBOpenDBRequest)
                .result as IDBDatabase;
              resolve(
                upgradeableDB.createObjectStore(this.store, {
                  autoIncrement: true,
                })
              );
            };
          } else {
            reject(new Error('Store already exists'));
          }
        });
      } else {
        reject(
          new Error('Model requires store to be set to create object store')
        );
      }
    });
  }

  getStore(): Promise<IDBObjectStore> {
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        this.getDB().then((db: IDBDatabase) => {
          const store = db
            .transaction(this.store, 'readwrite')
            .objectStore(this.store);
          resolve(store);
        });
      } else {
        reject(
          new Error('Model requires store to be set to create object store')
        );
      }
    });
  }

  deleteStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        this.getDB().then((db: IDBDatabase) => {
          if (db.objectStoreNames.contains(this.store)) {
            log.info('upgrading version');
            db.close();
            db.onclose = () => {
              log.info('db closed');
            };

            const upgradedDBRequest = window.indexedDB.open(
              this.store,
              db.version + 1
            );
            upgradedDBRequest.onupgradeneeded = (event) => {
              const upgradeableDB = event.target.result as IDBDatabase;
              log.info('onupgradeneeded');
              resolve(upgradeableDB.deleteObjectStore(this.store));
            };
          }
        });
      } else {
        reject(
          new Error('Model requires store to be set to create object store')
        );
      }
    });
  }

  add(item: T) {
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        const request = indexedDB.open(this.store);
        request.onsuccess = (event) => {
          if (typeof this.store === 'string') {
            const target = event.target as IDBOpenDBRequest;
            const db = target.result;
            resolve(
              db
                .transaction(this.store, 'readwrite')
                .objectStore(this.store)
                .add(item)
            );
          } else {
            throw new Error(
              'Model requires store to be set to create object store'
            );
          }
        };
      } else {
        throw new Error('Model requires store to be set to add items');
      }
    });
  }

  getAll() {
    if (typeof this.store === 'string') {
      const store = this.store;
      return new Promise((resolve, reject) => {
        const retrieval_request = window.indexedDB.open(this.store);
        retrieval_request.onsuccess = (event) => {
          if (event) {
            const target = event.target as IDBOpenDBRequest;
            const db = target.result;
            const retrieval = db
              .transaction([store])
              .objectStore(store)
              .getAll();
            resolve(retrieval);

            retrieval.onerror = (event) => {
              reject(event);
            };
            retrieval.onsuccess = (event) => {
              resolve((event.target as IDBOpenDBRequest).result);
            };
          }
        };
      });
    }
  }
}

export class Tag extends Model<{ text: string }> {
  store = 'tags';
}
