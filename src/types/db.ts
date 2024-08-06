import {IndexedDBTables} from "./interpreter.ts";


export interface GeneralObject {
    [key: string]: unknown
}

export interface GeneralArrayObject {
    [key: string]: unknown[]
}

export interface IndexedDBDump {
    [key: string]: GeneralArrayObject
}

export interface SiteBackup {
    idb: IndexedDBTables,
    lStorage: GeneralObject
}
