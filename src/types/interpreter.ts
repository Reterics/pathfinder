

export type JSPType = 'variableDeclaration' | 'binaryExpression' | 'number' | 'identifier' | 'functionCall' |
    'operator'| 'string' | 'memberExpression';

export type JSPOperator = '+' | '-'| '*'| '/' | '.';

export interface JSPStatement {
    type: JSPType,
    name?: string,
    value?: string|number|null|undefined|JSPStatement,
    operator?: JSPOperator,
    args?: (JSPStatement|undefined)[],

    left?: JSPStatement,
    right?: JSPStatement,

    object?: {value: object | string, type: JSPType}
    property?: JSPStatement
}

export interface StringObject {
    [key: string]: unknown
}
export interface FunctionHolder {
    [key: string]: (...args: unknown[])=>void
}


export interface IndexedDBStore {
    [key: string]: unknown[];
}

export interface IndexedDBTables {
    [key: string]: IndexedDBStore
}
