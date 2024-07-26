import {JSPStatement} from "../../types/interpreter.ts";

export class JSTokenizer {
    current: number;
    code: string;
    constructor(code: string) {
        this.code = code;
        this.current = 0;
    }

    getNextToken(): null|JSPStatement {
        if (this.current >= this.code.length) {
            return null;
        }

        let char = this.code[this.current];

        // Skip whitespaces
        while (/\s/.test(char)) {
            char = this.code[++this.current];
        }

        if (char === undefined) {
            return null;
        }

        // Identifiers (variable names, function names)
        if (/[a-zA-Z_$]/.test(char)) {
            let id = '';
            while (/[a-zA-Z0-9_$]/.test(char)) {
                id += char;
                char = this.code[++this.current];
            }
            return { type: 'identifier', value: id };
        }

        // Numbers
        if (/[0-9]/.test(char)) {
            let num = '';
            while (/[0-9]/.test(char)) {
                num += char;
                char = this.code[++this.current];
            }
            return { type: 'number', value: num };
        }

        // Operator of punctuation
        if ('=;,+-*/()'.includes(char)) {
            this.current++;
            return { type: 'operator', value: char };
        }

        throw new Error(`Unexpected character: ${char}`);
    }
}
