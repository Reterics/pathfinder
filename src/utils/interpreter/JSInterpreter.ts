import {FunctionHolder, JSPStatement, StringObject} from "../../types/interpreter.ts";
import {getFunctionFromString} from "../common.ts";
import {PFConnectorBackend} from "../connector.ts";
import * as functionLibrary from "./functionLibrary.ts";


export class JSInterpreter {
    variables: StringObject;
    functions: FunctionHolder;
    global: typeof globalThis;
    connector: PFConnectorBackend;
    constructor(connector: PFConnectorBackend) {
        this.variables = {};
        this.functions = functionLibrary;
        // eslint-disable-next-line no-undef
        this.global = typeof window !== "undefined" ? window : global || {};

        this.connector = connector;
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
                    //expression.property.name = object + '.' + expression.property.name;
                    return this.evaluateExpression({
                        name: object + '.' + expression.property.name,
                        type: 'functionCall',
                        args: expression.property.args,
                        value: expression.property.value
                    });
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

    executeFunctionCall(expression: string | number | JSPStatement | null | undefined): undefined|void|Promise<unknown> {
        if (!expression || typeof expression !== 'object' || typeof expression.name !== 'string') {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        let func = this.functions[expression.name] || this.global[expression.name];
        if (typeof func !== 'function' && expression.name) {
            const decodedFunction = getFunctionFromString(expression.name, this.global as Window & typeof globalThis) as ()=>void|null;

            if (typeof decodedFunction === 'function') {
                func = decodedFunction;
            } else {
                return this.connector.sendMessage({
                    method: expression.name,
                    args: expression.args ? expression.args.map(arg => this.evaluateExpression(arg)) : undefined,
                });
                // throw new Error(`Unknown function: ${expression.name}`);
            }
        }
        if (expression.args) {
            const args = expression.args.map(arg => this.evaluateExpression(arg));
            return func(...args);
        }
        return func();
    }
}
