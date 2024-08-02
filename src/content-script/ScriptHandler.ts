import {InjectedScript, ParsedInjectedScripts} from "../types/scripts.ts";
import {JSTokenizer} from "../utils/interpreter/JSTokenizer.ts";
import {JSParser} from "../utils/interpreter/JSParser.ts";
import {JSInterpreter} from "../utils/interpreter/JSInterpreter.ts";
import {JSPStatement} from "../types/interpreter.ts";

export class ScriptHandler {
    private readonly _loaded: ParsedInjectedScripts;
    constructor() {
        this._loaded = {};

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            const scripts = (this._loaded[evt.key] || []);

            if (scripts.length > 0) {
                console.log('Execute: ', scripts);
                const results:string[] = [];
                const interpreter = new JSInterpreter();

                scripts.reduce( async (promise: Promise<string[]>, script) => {
                    const result: string[] = await promise;
                    results.push(result.join("\n"));

                    return interpreter.execute(script.parsed) as Promise<string[]>;
                }, Promise.resolve([]))
                    .then(() => {
                        console.log('Scripts are executed ', results);
                    })
            }
        })
    }

    loadScript({id, name, keyBind, content, origin}: InjectedScript): void {
        if (Object
            .values(this._loaded)
            .filter(entry => entry.find(l => l.id === id))
            .length) {
            console.warn(`[ScriptHandler] ${id} already loaded as ${name}.`);
            return;
        }

        if (!this._loaded[keyBind]) {
            this._loaded[keyBind] = [];
        }

        if (!content) {
            console.warn(`[ScriptHandler] ${id} is empty.`)
        }

        // Origin can be /http(s)?:\/\/.+\.com/g
        if (!origin || location.origin.match(new RegExp(origin))) {
            const tokenizer = new JSTokenizer(content);
            const parser = new JSParser(tokenizer);

            this._loaded[keyBind].push({
                id,
                name,
                content,
                keyBind,
                parsed: parser.parse().filter(p => p) as JSPStatement[]
            });
        }
    }

    execute(id: number | undefined) {
        const script = Object.keys(this._loaded)
            .reduce((out: InjectedScript | undefined, keyBind: string) : InjectedScript | undefined=> {
                if (!out && Array.isArray(this._loaded[keyBind])) {
                    out = this._loaded[keyBind].find(script => script.id === id);
                }

                return out;
        }, undefined);

        if (script) {
            const tokenizer = new JSTokenizer(script.content);
            const parser = new JSParser(tokenizer);
            const interpreter = new JSInterpreter();

            const parsedCode = parser.parse();

            return interpreter.execute(parsedCode) as Promise<string[]>;
        } else {
            console.warn('Script is not found with given id: ' + id);
        }
    }
}
