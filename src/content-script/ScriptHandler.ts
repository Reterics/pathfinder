import {InjectedScript, InjectedScripts} from "../types/scripts.ts";
import {JSTokenizer} from "../utils/interpreter/JSTokenizer.ts";
import {JSParser} from "../utils/interpreter/JSParser.ts";
import {JSInterpreter} from "../utils/interpreter/JSInterpreter.ts";

export class ScriptHandler {
    private readonly _loaded: InjectedScripts;
    constructor() {
        this._loaded = {};

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            const scripts = this._loaded[evt.key] || [];

            if (scripts.length > 0) {
                console.log('Execute: ', scripts);
                const results:string[] = [];
                scripts.reduce( async (promise: Promise<string[]>, script) => {
                    const result: string[] = await promise;
                    results.push(result.join("\n"));

                    const tokenizer = new JSTokenizer(script.content);
                    const parser = new JSParser(tokenizer);
                    const interpreter = new JSInterpreter();

                    const parsedCode = parser.parse();

                    return interpreter.execute(parsedCode) as Promise<string[]>;
                }, Promise.resolve([]))
                    .then(() => {
                        console.log('Scripts are executed ', results);
                    })
            }
        })
    }

    loadScript({name, keyBind, content, origin}: InjectedScript): void {
        if (Object
            .values(this._loaded)
            .filter(entry => entry.find(l => l.name === name))
            .length) {
            console.warn(`[ScriptHandler] ${name} already loaded.`);
            return;
        }

        if (!this._loaded[keyBind]) {
            this._loaded[keyBind] = [];
        }

        // Origin can be /http(s)?:\/\/.+\.com/g
        if (!origin || location.origin.match(new RegExp(origin))) {
            this._loaded[keyBind].push({
                name,
                content,
                keyBind
            });
        }
    }
}
