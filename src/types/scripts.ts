

export interface InjectedScripts {
    [key: string]: InjectedScript[]
}

export interface InjectedScript {
    id?: number,
    name: string,
    keyBind: string,
    content: string,
    origin?: string
}

export type ScriptKeys  = 'name'|'content'|'keyBind'|'origin';

export interface TextFile {
    value: string|ArrayBuffer|null,
    file_input?: File
}

export interface NestedObject {
    [key: string|number]: string|number|undefined|null|NestedObject|NestedObject[]
}

export interface SearchStack {
    obj: unknown,
    index: number
}
