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

export interface WebNote {
    id: string,
    url?: string,
    text: string,
    theme?: 'default'|'pink'|'blue'|'yellow'|'red'|'gray',
    created: number,
    modified: number
}

export type WebNoteKey = 'id' | 'url' | 'text' | 'created' | 'modified'

export interface WebNoteProps extends WebNote {
    delete: ()=>unknown,
    update: (key: WebNoteKey, value: string | number) => unknown
}
