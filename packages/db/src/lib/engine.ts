import { log } from './logs';
export class Engine {
  static getDB(name: string): Promise<IDBDatabase> {
    log.debug(`getDB for ${name}`);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        log.info('getDB request onupgradeneeded');
        db.onclose = () => {
          log.info('getDb onclose db closed from getDB');
        };
        db.close();
        resolve(db);
      };
      request.onerror = (event) => {
        log.error('getDB request onerror', event);
        reject((event.target as IDBOpenDBRequest).error);
      };
      request.onblocked = function (event) {
        log.error('getDB request onblocked');
        reject(event);
      };
      request.onsuccess = function (event) {
        log.debug('getDB request onsuccess');
        const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve(db);
      };
    });
  }
  static createStore = (
    dbName: string,
    storeName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true, keyPath: 'id' }
  ): Promise<IDBObjectStore> => {
    log.debug(`createStore dbName: ${dbName} storeName: ${storeName}`, options);
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.onclose = (e) => {
            log.debug('createStore db onclose');
          };
          db.onabort = () => {
            log.debug('createStore db onabort');
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
            log.debug('createStore upgradedDBRequest onblocked');
          };
          let createdStore: IDBObjectStore;
          upgradedDBRequest.onupgradeneeded = (event) => {
            log.debug('createStore upgradedDBRequest onupgradeneeded');
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
    log.debug(`getStore for dbName: ${dbName} storeName: ${storeName}`);
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        const transaction = db.transaction(storeName, 'readwrite');
        transaction.onabort = (event) => {
          log.debug('getStore transaction onabort', event);
        };
        transaction.oncomplete = (event) => {
          log.info('getStore transaction oncomplete', event);
        };
        transaction.onerror = (event) => {
          log.fatal('getStore transaction onerror', event);
        };
        const store = transaction.objectStore(storeName);
        resolve(store);
      });
    });
  }

  static deleteStore(dbName: string, storeName: string): Promise<void> {
    log.debug(`deleteStore for dbName: ${dbName} storeName: ${storeName}`);
    return new Promise((resolve, reject) => {
      return Engine.getDB(dbName).then((db: IDBDatabase) => {
        if (db.objectStoreNames.contains(storeName)) {
          log.debug('upgrading version');
          db.close();
          db.onclose = () => {
            log.info('deleteStore db onclose');
          };

          const upgradedDBRequest = window.indexedDB.open(
            dbName,
            db.version + 1
          );
          upgradedDBRequest.onblocked = (event) => {
            log.debug('deleteStore upgradedDBRequest onblocked');
          };
          upgradedDBRequest.onerror = (event) => {
            log.debug('deleteStore upgradedDBRequest onerror');
            reject(event.target);
          };
          upgradedDBRequest.onsuccess = (event) => {
            log.debug('deleteStore upgradedDBRequest onsuccess');
            resolve();
          };
          upgradedDBRequest.onupgradeneeded = (event) => {
            log.debug('deleteStore upgradedDBRequest onupgradeneeded');
            const upgradeableDB = (event.target as IDBOpenDBRequest)
              .result as IDBDatabase;
            resolve(upgradeableDB.deleteObjectStore(storeName));
          };
        }
      });
    });
  }

  static add(dbName: string, store: string, item: unknown): Promise<number> {
    log.debug(`add for ${dbName}, ${store}`);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = (event) => {
        log.debug('add request onsuccess');
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
          log.debug('add transaction onsuccess');
          resolve((e.target as IDBRequest).result);
        };
      };
    });
  }

  static getAll<T>(dbName: string, storeName: string): Promise<T[]> {
    log.debug(`getAll for dbName: ${dbName} storeName: ${storeName}`);
    return new Promise((resolve, reject) => {
      const retrievalRequest = window.indexedDB.open(dbName);
      retrievalRequest.onsuccess = (event) => {
        log.debug('getAll retrievalRequest onsuccess');
        if (event) {
          const target = event.target as IDBOpenDBRequest;
          const db = target.result;
          const retrieval = db
            .transaction([storeName])
            .objectStore(storeName)
            .getAll();

          retrieval.onerror = (event) => {
            log.error('getAll retrievalRequest onerror');
            reject(event);
          };
          retrieval.onsuccess = (event) => {
            log.debug('getAll retrievalRequest onsuccess');
            resolve(
              (event.target as IDBOpenDBRequest).result as unknown as T[]
            );
          };
        }
      };
    });
  }

  static put(
    dbName: string,
    storeName: string,
    item: unknown,
    key?: IDBValidKey
  ): Promise<IDBValidKey> {
    log.debug(`put for dbName: ${dbName} storeName: ${storeName} key: ${key}`);
    return new Promise((resolve, reject) => {
      return Engine.getStore(dbName, storeName).then((store) => {
        try {
          const request = store.put(item, key);
          request.onerror = (event) => {
            log.error('put request onerror');
            reject(event);
          };
          request.onsuccess = (event) => {
            log.error('put request onsuccess');
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
  ): Promise<void> {
    log.debug(
      `delete for dbName: ${dbName} storeName: ${storeName} key: ${key}`
    );
    return new Promise((resolve, reject) => {
      return Engine.getStore(dbName, storeName).then((store) => {
        const deletionRequest = store.delete(key);

        deletionRequest.onerror = (event) => {
          log.info('delete deletionRequest onerror');
          reject(event);
        };
        deletionRequest.onsuccess = (event) => {
          log.info('delete deletionRequest onsuccess');
          resolve(undefined);
        };
      });
    });
  }
}
