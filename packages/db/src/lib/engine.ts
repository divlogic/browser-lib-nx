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
    storeName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true, keyPath: 'id' }
  ): Promise<IDBObjectStore> => {
    log.info('creating the store');
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        if (!db.objectStoreNames.contains(storeName)) {
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
          upgradedDBRequest.onupgradeneeded = (event) => {
            log.info('onupgradeneeded', event);
            const upgradeableDB = (event.target as IDBOpenDBRequest)
              .result as IDBDatabase;
            createdStore = upgradeableDB.createObjectStore(storeName, options);
            resolve(createdStore);
          };
        } else {
          reject(new Error('Store already exists'));
        }
      });
    });
  };

  static getStore(dbName: string, storeName: string): Promise<IDBObjectStore> {
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        resolve(store);
      });
    });
  }

  static deleteStore(dbName: string, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        if (db.objectStoreNames.contains(storeName)) {
          log.info('upgrading version');
          db.close();
          db.onclose = () => {
            log.info('db closed');
          };

          const upgradedDBRequest = window.indexedDB.open(
            dbName,
            db.version + 1
          );
          upgradedDBRequest.onblocked = (event) => {
            log.info('onblocked, delete', event.target);
          };
          upgradedDBRequest.onerror = (event) => {
            reject(event.target);
          };
          upgradedDBRequest.onsuccess = (event) => {
            log.info('onsuccess');
            resolve();
          };
          upgradedDBRequest.onupgradeneeded = (event) => {
            log.info('onupgradeneeded, delete');
            const upgradeableDB = (event.target as IDBOpenDBRequest)
              .result as IDBDatabase;
            resolve(upgradeableDB.deleteObjectStore(storeName));
          };
        }
      });
    });
  }

  static add(dbName: string, store: string, item: unknown): Promise<number> {
    return new Promise((resolve, reject) => {
      log.info('opening db');
      const request = indexedDB.open(dbName);
      request.onsuccess = (event) => {
        log.info('onsuccess');
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        const transaction = db
          .transaction(store, 'readwrite')
          .objectStore(store)
          .add(item);
        transaction.onerror = (e) => {
          log.error(e);
          reject(e);
        };
        transaction.onsuccess = (e) => {
          resolve((e.target as IDBRequest).result);
        };
      };
    });
  }

  static getAll<T>(dbName: string, storeName: string): Promise<T[]> {
    log.info('initiating getAll');
    return new Promise((resolve, reject) => {
      const retrievalRequest = window.indexedDB.open(dbName);
      retrievalRequest.onsuccess = (event) => {
        log.info('onsuccess');
        if (event) {
          const target = event.target as IDBOpenDBRequest;
          const db = target.result;
          const retrieval = db
            .transaction([storeName])
            .objectStore(storeName)
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
  }

  static put(item: T, key?: IDBValidKey): Promise<IDBValidKey> {
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

  static delete(
    dbName: string,
    storeName: string,
    key: IDBValidKey | IDBKeyRange
  ): Promise<undefined> {
    log.info('initiating delete');
    return new Promise((resolve, reject) => {
      return Engine.getStore(dbName, storeName).then((store) => {
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
