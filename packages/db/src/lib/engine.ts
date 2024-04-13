import { log } from './logs';
export class Engine {
  static getDB(name: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
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
        console.error(event);
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
  }

  storeNotSetError() {
    return new Error('Model requires store to be set.');
  }

  static createStore = (
    dbName: string,
    store: string,
    options: IDBObjectStoreParameters = { autoIncrement: true, keyPath: 'id' }
  ): Promise<IDBObjectStore> => {
    log.info('creating the store');
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        console.log('create store getdb: ', dbName);
        if (!db.objectStoreNames.contains(store)) {
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
            dbName,
            db.version + 1
          );
          upgradedDBRequest.onblocked = (event) => {
            // Database needs to acknowledge the request
            log.info('onblocked', event);
          };
          let createdStore: IDBObjectStore;
          upgradedDBRequest.onsuccess = (event) => {
            console.log('ON SUCCESS RESOLVING');
            resolve(createdStore);
          };
          upgradedDBRequest.onupgradeneeded = (event) => {
            log.info('onupgradeneeded', event);
            const upgradeableDB = (event.target as IDBOpenDBRequest)
              .result as IDBDatabase;
            createdStore = upgradeableDB.createObjectStore(store, options);
            console.log('SUCCESSFULLY CREATED STORE?');
          };
        } else {
          reject(new Error('Store already exists'));
        }
      });
    });
  };

  static getStore(db: string, storeName: string): Promise<IDBObjectStore> {
    console.log('getStore');
    return new Promise((resolve, reject) => {
      return Engine.getDB(db).then((db: IDBDatabase) => {
        console.log('db is: ', db);
        const transaction = db.transaction(storeName, 'readwrite');
        console.log('transaction is: ', transaction);

        const store = transaction.objectStore(storeName);
        console.log('Store is: ', store);
        resolve(store);
      });
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

  add(item: T): Promise<number> {
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        log.info('opening db');
        const request = indexedDB.open(this.store);
        request.onsuccess = (event) => {
          log.info('onsuccess');
          const target = event.target as IDBOpenDBRequest;
          const db = target.result;
          const transaction = db
            .transaction(this.store, 'readwrite')
            .objectStore(this.store)
            .add(item);
          transaction.onerror = (e) => {
            log.error(e);
            reject(e);
          };
          transaction.onsuccess = (e) => {
            resolve((e.target as IDBRequest).result);
          };
        };
      } else {
        throw new Error('Model requires store to be set to add items');
      }
    });
  }

  getAll(): Promise<T[]> {
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
              resolve(
                (event.target as IDBOpenDBRequest).result as unknown as T[]
              );
            };
          }
        };
      });
    } else {
      throw this.storeNotSetError();
    }
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
