

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
