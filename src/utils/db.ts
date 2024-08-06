import {IndexedDBTables} from "../types/interpreter.ts";
import {GeneralObject, IndexedDBDump} from "../types/db.ts";

export async function getAllDataFromObjectStore(db: IDBDatabase, storeName: string): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function openIDBDatabase(name: string, storesToUpgrade: string[] = []): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name);
        if (storesToUpgrade && storesToUpgrade.length) {
            request.onupgradeneeded = function(event) {
                let db = request.result;

                if(!db && event.target) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    db = event.target.result;
                }
                for (const storeName of storesToUpgrade) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                    }
                }
            };
        }
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function backupIDBDatabase(): Promise<IndexedDBTables> {
    const backup: IndexedDBTables = {};

    // List all databases
    const databases: IDBDatabaseInfo[] = await window.indexedDB.databases();
    for (let i = 0; i < databases.length; i++){
        const dbInfo: IDBDatabaseInfo = databases[i];
        const dbName = dbInfo.name;
        if (!dbName) {
            continue;
        }
        const db: IDBDatabase = await openIDBDatabase(dbName);
        backup[dbName] = {};

        // List all object stores
        const objectStores = Array.from(db.objectStoreNames);
        for (let j = 0; j < objectStores.length; j++){
            const storeName = objectStores[j];
            backup[dbName][storeName] = await getAllDataFromObjectStore(db, storeName);
        }
        db.close();
    }
    return backup;
}

export async function appendIDBStore(db: IDBDatabase, storeName: string, data: unknown[]) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        for (const item of data) {
            store.put(item);
        }
        transaction.oncomplete = function() {
            resolve();
        };
        transaction.onerror = function(event) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            reject(event.target?.error);
        };
    });
}

export async function appendIDBStores(backupData: IndexedDBDump) {
    for (const dbName in backupData) {
        const dbData = backupData[dbName];
        const db: IDBDatabase = await openIDBDatabase(dbName, Object.keys(dbData));
        for (const storeName in dbData) {
            await appendIDBStore(db, storeName, dbData[storeName]);
        }
        db.close();
    }
}

export function backupLStorage() {
    const localStorageData: GeneralObject= {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            localStorageData[key] = localStorage.getItem(key);
        }
    }
    return localStorageData;
}

export function appendLStorage (localStorageData: GeneralObject) {
    for (const key in localStorageData) {
        localStorage.setItem(key, <string>localStorageData[key]);
    }
}
