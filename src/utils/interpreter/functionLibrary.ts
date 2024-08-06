import {IndexedDBTables} from "../../types/interpreter.ts";
import {downloadFile, readJSONFile} from "../common.ts";
import {
    appendIDBStores,
    appendLStorage,
    backupIDBDatabase, backupLStorage
} from "../db.ts";
import {GeneralObject, IndexedDBDump, SiteBackup} from "../../types/db.ts";

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
    const backup: IndexedDBTables = await backupIDBDatabase();

    downloadFile(JSON.stringify(backup, null, 2), 'indexeddb-backup.json',
        'application/json');
};

export const restoreIndexedDB = async () => {
    const backupData = await readJSONFile();

    if (backupData) {
        await appendIDBStores(backupData as IndexedDBDump);
    }
};

export const backupLocalStorage = async () => {
    const backup: GeneralObject = backupLStorage();
    downloadFile(JSON.stringify(backup, null, 2), 'lstorage-backup.json',
        'application/json');
};

export const restoreLocalStorage = async () => {
    const backupData = await readJSONFile();

    if (backupData) {
        appendLStorage(backupData as GeneralObject);
    }
};

export const backupDB = async () => {
    const IDB: IndexedDBTables = await backupIDBDatabase(),
        LStorage: GeneralObject = backupLStorage();

    downloadFile(JSON.stringify({
        idb: IDB,
        lStorage: LStorage
    }, null, 2), 'backup.json',
    'application/json');
};

export const restoreDB = async () => {
    const backupData = await readJSONFile() as SiteBackup|null;

    if (backupData) {
        appendLStorage(backupData.lStorage);
        await appendIDBStores(backupData.idb);
    }
};
