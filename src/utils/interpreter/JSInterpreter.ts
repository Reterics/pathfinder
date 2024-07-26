import {FunctionHolder, JSPStatement, StringObject} from "../../types/interpreter.ts";


export class JSInterpreter {
    variables: StringObject;
    functions: FunctionHolder;
    global: typeof globalThis;
    constructor() {
        this.variables = {};
        this.functions = {
            log: (arg: unknown) => console.log(arg),
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
            default:
                throw new Error(`Unknown statement type: ${statement.type}`);
        }
    }

    evaluateExpression(expression: string | number | JSPStatement | null | undefined): unknown {
        let x, y;
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
        const func = this.functions[expression.name] || this.global[expression.name];
        if (typeof func !== 'function') {
            throw new Error(`Unknown function: ${expression.name}`);
        }
        if (expression.args) {
            const args = expression.args.map(arg => this.evaluateExpression(arg));
            return func(...args);
        }
        return func();
    }
}
