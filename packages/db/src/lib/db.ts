import { Logger, ILogObj } from 'tslog';
const log: Logger<ILogObj> = new Logger({ hideLogPositionForProduction: true });

export abstract class Model<T> {
  abstract store: string;

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

  createStore(
    options: IDBObjectStoreParameters = { autoIncrement: true, keyPath: 'id' }
  ): Promise<IDBObjectStore> {
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
              resolve(upgradeableDB.createObjectStore(this.store, options));
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

  put(item: T, key?: IDBValidKey): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      return this.getStore().then((store) => {
        try {
          const request = store.put(item, key);
          request.onerror = (event) => {
            reject(event);
          };
          request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result);
          };
        } catch (e) {
          reject(e);
        }
      });
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
            upgradedDBRequest.onblocked = () => {
              log.info('onblocked, delete');
            };
            upgradedDBRequest.onerror = (event) => {
              reject(event);
            };
            upgradedDBRequest.onsuccess = (event) => {
              log.info('onsuccess');
            };
            upgradedDBRequest.onupgradeneeded = (event) => {
              log.info('onupgradeneeded, delete');
              const upgradeableDB = (event.target as IDBOpenDBRequest)
                .result as IDBDatabase;
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
        log.info('opening db');
        const request = indexedDB.open(this.store);
        request.onsuccess = (event) => {
          log.info('onsuccess');
          const target = event.target as IDBOpenDBRequest;
          const db = target.result;
          resolve(
            db
              .transaction(this.store, 'readwrite')
              .objectStore(this.store)
              .add(item)
          );
        };
      } else {
        throw new Error('Model requires store to be set to add items');
      }
    });
  }

  getAll() {
    if (typeof this.store === 'string') {
      log.info('initiating getAll');
      return new Promise((resolve, reject) => {
        const retrievalRequest = window.indexedDB.open(this.store);
        retrievalRequest.onsuccess = (event) => {
          log.info('onsuccess');
          if (event) {
            const target = event.target as IDBOpenDBRequest;
            const db = target.result;
            const retrieval = db
              .transaction([this.store])
              .objectStore(this.store)
              .getAll();

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

  delete(key: IDBValidKey | IDBKeyRange): Promise<undefined> {
    log.info('initiating delete');
    return new Promise((resolve, reject) => {
      return this.getStore().then((store) => {
        const deletionRequest = store.delete(key);
        deletionRequest.onerror = (event) => {
          log.info('onerror');
          reject(event);
        };
        deletionRequest.onsuccess = (event) => {
          log.info('onsuccess');
          resolve((event.target as IDBRequest).result);
        };
      });
    });
  }
}
