export abstract class Model<T> {
  store: string | null = null;
  timeout = 3000;
  getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.store);
      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        resolve(db);
      };
      request.onerror = (event) => {
        reject(event);
      };
      request.onblocked = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        const db = event.target.result as IDBDatabase;
        resolve(db);
      };
    });
  }

  createStore() {
    return new Promise((resolve, reject) => {
      if (typeof this.store === 'string') {
        this.getDB().then((db: IDBDatabase) => {
          if (!db.objectStoreNames.contains(this.store)) {
            console.log('Upgrading version');
            db.close();
            db.onclose = () => {
              console.log('closed the db');
            };

            const upgradedDBRequest = window.indexedDB.open(
              this.store,
              db.version + 1
            );
            upgradedDBRequest.onupgradeneeded = (event) => {
              const upgradeableDB = event.target.result as IDBDatabase;
              console.log('onupgrade needed');
              resolve(
                upgradeableDB.createObjectStore(this.store, {
                  autoIncrement: true,
                })
              );
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
            console.log('Upgrading version');
            db.close();
            db.onclose = () => {
              console.log('closed the db');
            };

            const upgradedDBRequest = window.indexedDB.open(
              this.store,
              db.version + 1
            );
            upgradedDBRequest.onupgradeneeded = (event) => {
              const upgradeableDB = event.target.result as IDBDatabase;
              console.log('onupgrade needed');
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
              // console.log('retrieval.onsuccess: ', event.target.result);
              resolve(event.target.result);
            };
            // console.log('event.target.result is: ', db);
          }
        };
      });
    }
  }
}

export class Tag extends Model<{ text: string }> {
  store = 'tags';
}
