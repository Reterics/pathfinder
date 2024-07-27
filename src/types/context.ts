import {InjectedScript} from "./scripts.ts";


export interface ContextData {
    entries: InjectedScript[],
}

export interface ContextAPI {
    data: ContextData,
    setData: (key: string, value: unknown) => void,
}
