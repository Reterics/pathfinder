import {JSPOperator, JSPStatement, JSPType} from "../../types/interpreter.ts";
import {JSTokenizer} from "./JSTokenizer.ts";

export class JSParser {
    tokenizer: JSTokenizer;
    currentToken: JSPStatement | null;
    constructor(tokenizer: JSTokenizer) {
        this.tokenizer = tokenizer;
        this.currentToken = this.tokenizer.getNextToken();
    }

    parse(): (JSPStatement|undefined)[] {
        const statements = [];
        while (this.currentToken !== null) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    parseStatement(): JSPStatement|undefined {
        if( this.currentToken !== null ) {
            if (this.currentToken.type === 'identifier' &&
                (this.currentToken.value === 'var' || this.currentToken.value === 'const' || this.currentToken.value === 'let')) {
                return this.parseVariableDeclaration();
            } else if (this.currentToken.type === 'identifier') {
                return this.parseExpression();
            } else {
                throw new Error(`Unexpected token: ${this.currentToken.value}`);
            }
        }
        throw new Error(`No token to parse`);
    }

    parseVariableDeclaration(): JSPStatement|undefined {
        this.proc('identifier'); // proc 'var'
        const name = this.currentToken && this.currentToken.value;
        if (typeof name !== 'string') {
            return undefined;
        }
        this.proc('identifier'); // proc variable name
        this.proc('operator'); // proc '='
        const value = this.parseExpression();
        this.proc('operator'); // proc ';'
        return {type: 'variableDeclaration', name, value};
    }

    parseExpression(): JSPStatement | undefined {
        let left = this.parsePrimary();

        while (this.currentToken && this.currentToken.type === 'operator' && ['+', '-', '*', '/', '.'].includes(<string>this.currentToken.value)) {
            const operator = this.currentToken.value as JSPOperator;
            this.proc('operator');
            if (operator === '.') {
                const right = this.parsePrimary();
                left = { type: 'memberExpression', object: left as {
                        value: string | object; type: JSPType; } | undefined, property: right };
            } else {
                const right = this.parsePrimary();
                left = {type: 'binaryExpression', operator, left, right};
            }

        }

        return left;
    }

    parsePrimary(): JSPStatement|undefined {
        if (this.currentToken !== null) {
            if (this.currentToken?.type === 'identifier') {
                const identifier = this.currentToken.value;
                this.proc('identifier');

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                if (this.currentToken?.type === 'operator' && this.currentToken?.value === '(') {
                    return this.parseFunctionCall(<string>identifier);
                }

                return {type: 'identifier', value: identifier};
            } else if (this.currentToken.type === 'number') {
                const number = this.currentToken.value;
                this.proc('number');
                return {type: 'number', value: number};
            } else if (this.currentToken.type === 'string') {
                const str = this.currentToken.value;
                this.proc('string');
                return { type: 'string', value: str };
            }
        }

    }

    parseFunctionCall(name: string): JSPStatement {
        this.proc('operator'); // proc '('
        const args = [];
        while (this.currentToken?.type !== 'operator' || this.currentToken?.value !== ')') {
            args.push(this.parseExpression());
            if (this.currentToken?.type === 'operator' && this.currentToken?.value === ',') {
                this.proc('operator'); // proc ','
            }
        }
        this.proc('operator'); // proc ')'
        this.proc('operator'); // proc ';'
        return {type: 'functionCall', name, args};
    }

    proc(type:JSPType) {
        if (this.currentToken?.type === type) {
            this.currentToken = this.tokenizer.getNextToken();
        } else {
            throw new Error(`Unexpected token: ${this.currentToken?.value}`);
        }
    }
}
