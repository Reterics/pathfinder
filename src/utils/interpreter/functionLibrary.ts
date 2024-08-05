import {IndexedDBTables} from "../../types/interpreter.ts";
import {readTextFile} from "../common.ts";

/**
 * Function Library has several pre-defined method to be executed in Content-Scripts against DOM
 * We need these libraries due to the limitations we have in ContentScripts and to simplify the plugin usage
 */

export const log = (arg: unknown) => console.log(arg);

export const querySelectorClick = (arg: unknown) => {
    const node = document.querySelector(arg as string);
    if (node) {
        (node as HTMLDivElement).click();
    } else {
        console.warn('Element is not found with selector: ', arg);
    }
};

export const querySelectorValue = (selector: unknown, value: unknown) => {
    const node = document.querySelector(selector as string);
    if (node) {
        (node as HTMLInputElement).value = value as string;
        node.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }))
    } else {
        console.warn('Element is not found with selector: ', selector);
    }
};

export const querySelectorAllClick = (selector: unknown) => {
    document.querySelectorAll(selector as string)
        .forEach(node => (node as HTMLDivElement).click());
};

export const querySelectorAllValue = (selector: unknown, value: unknown) => {
    document.querySelectorAll(selector as string)
        .forEach(node => {
            (node as HTMLInputElement).value = value as string;
            node.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
        });
};

export const backupIndexedDB = async () => {
    const backup: IndexedDBTables = {};

    // List all databases
    const databases: IDBDatabaseInfo[] = await window.indexedDB.databases();
    for (let i = 0; i < databases.length; i++){
        const dbInfo: IDBDatabaseInfo = databases[i];
        const dbName = dbInfo.name;
        if (!dbName) {
            continue;
        }
        const db: IDBDatabase = await openDatabase(dbName);
        backup[dbName] = {};

        // List all object stores
        const objectStores = Array.from(db.objectStoreNames);
        for (let j = 0; j < objectStores.length; j++){
            const storeName = objectStores[j];
            backup[dbName][storeName] = await getAllDataFromObjectStore(db, storeName);
        }
        db.close();
    }

    // Download backup as a JSON file
    const backupBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(backupBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indexeddb-backup.json';
    a.click();
    URL.revokeObjectURL(url);

    async function openDatabase(name: string): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function getAllDataFromObjectStore(db: IDBDatabase, storeName: string): Promise<unknown[]> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

export const restoreIndexedDB = async () => {
    const file = await readTextFile();
    if (!file || !file.value || typeof file.value !== 'string') {
        return;
    }

    let backupData = null;

    try {
        backupData = JSON.parse(file.value)
    } catch (err) {
        console.error(err);
    }

    if (!backupData) {
        return;
    }

    for (const dbName in backupData) {
        const dbData = backupData[dbName];
        const db: IDBDatabase = await openDatabase(dbName, Object.keys(dbData));
        for (const storeName in dbData) {
            await populateObjectStore(db, storeName, dbData[storeName]);
        }
        db.close();
    }

    function openDatabase(name: string, storeNames: string[]): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name);
            request.onupgradeneeded = function(event) {
                let db = request.result;

                if(!db && event.target) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    db = event.target.result;
                }
                for (const storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                    }
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function populateObjectStore(db: IDBDatabase, storeName: string, data: never[]): Promise<void> {
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
}
