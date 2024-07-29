import {InjectedScript} from "./scripts.ts";


export interface ContextData {
    entries: InjectedScript[],
}

export type ContextDataType = 'entry';

export interface ContextAPI {
    data: ContextData,
    setData: (key: string, value: unknown) => void,
    use: (id: number, type: ContextDataType) => void
}
