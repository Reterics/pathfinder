import {FunctionHolder, IndexedDBTables, JSPStatement, StringObject} from "../../types/interpreter.ts";
import {getFunctionFromString} from "../common.ts";


export class JSInterpreter {
    variables: StringObject;
    functions: FunctionHolder;
    global: typeof globalThis;
    constructor() {
        this.variables = {};
        this.functions = {
            log: (arg: unknown) => console.log(arg),
            querySelectorClick: (arg: unknown) => {
                const node = document.querySelector(arg as string);
                if (node) {
                    (node as HTMLDivElement).click();
                } else {
                    console.warn('Element is not found with selector: ', arg);
                }
            },
            querySelectorValue: (selector: unknown, value: unknown) => {
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
            },
            querySelectorAllClick: (selector: unknown) => {
                document.querySelectorAll(selector as string)
                    .forEach(node => (node as HTMLDivElement).click());
            },
            querySelectorAllValue: (selector: unknown, value: unknown) => {
                document.querySelectorAll(selector as string)
                    .forEach(node => {
                        (node as HTMLInputElement).value = value as string;
                        node.dispatchEvent(new Event('input', {
                            bubbles: true,
                            cancelable: true
                        }));
                    });
            },
            backupIndexedDB: async () => {
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
            }
        };
        // eslint-disable-next-line no-undef
        this.global = typeof window !== "undefined" ? window : global || {};
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    async execute(statements: (JSPStatement|undefined)[]): Promise<unknown> {
        for (let i = 0; i < statements.length; i++){
            const statement = statements[i];
            if (statement) {
                const result = this.executeStatement(statement);
                if (result) {
                    await result;
                }
            }
        }
    }

    executeStatement(statement: JSPStatement): void | Promise<unknown> | undefined {
        switch (statement.type) {
            case 'variableDeclaration':
                if (statement.name) {
                    this.variables[statement.name] = this.evaluateExpression(statement.value);
                }
                break;
            case 'functionCall':
                return this.executeFunctionCall(statement);
            case 'memberExpression':
                if (statement.name) {
                    this.variables[statement.name] = this.evaluateExpression(statement);
                } else {
                    this.evaluateExpression(statement);
                }
                break;
            default:
                throw new Error(`Unknown statement type: ${statement.type}`);
        }
    }

    evaluateExpression(expression: string | number | JSPStatement | null | undefined): unknown {
        let x, y, object;
        if (!expression || typeof expression !== 'object') {
            return;
        }
        switch (expression.type) {
            case 'identifier':
                if (typeof expression.value === 'string' || typeof expression.value === 'number') {
                    return this.variables[expression.value];
                }
                break;
            case 'number':
                return Number(expression.value);
            case 'string':
                return expression.value;
            case 'binaryExpression':
                x = this.evaluateExpression(expression.left) as number;
                y = this.evaluateExpression(expression.right) as number;
                switch (expression.operator) {
                    case '+':
                        return x + y;
                    case '-':
                        return x - y;
                    case '*':
                        return x * y;
                    case '/':
                        return x / y;
                    default:
                        throw new Error(`Unknown operator: ${expression.operator}`);
                }
            case 'memberExpression':
                if (expression.object && expression.object?.value) {
                    object = expression.object.value as string;
                } else if (expression.object && expression.object.type ===  'memberExpression') {
                    // Recursive
                    object = this.evaluateExpression(expression.object as JSPStatement);
                }
                if (expression.property && expression.property.type === 'functionCall') {
                    expression.property.name = object + '.' + expression.property.name;
                    return this.evaluateExpression(expression.property);
                } else if (expression.property && expression.property.type === 'identifier') {
                    return object + '.' + expression.property.value;
                }
                return null;
            case 'functionCall':
                return this.executeFunctionCall(expression);
            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    executeFunctionCall(expression: string | number | JSPStatement | null | undefined): undefined|void|Promise<void> {
        if (!expression || typeof expression !== 'object' || typeof expression.name !== 'string') {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        let func = this.functions[expression.name] || this.global[expression.name];
        if (typeof func !== 'function' && expression.name) {
            const messages = getFunctionFromString(expression.name, this.global as Window & typeof globalThis) as (()=>void)[]

            const lastElement = messages[messages.length - 1];
            if (typeof lastElement === 'function') {
                func = lastElement;
            } else {
                throw new Error(`Unknown function: ${expression.name}`);
            }
        }
        if (expression.args) {
            const args = expression.args.map(arg => this.evaluateExpression(arg));
            return func(...args);
        }
        return func();
    }
}
