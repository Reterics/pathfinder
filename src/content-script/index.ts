import {ScriptHandler} from "./ScriptHandler.ts";
import {InjectedScript} from "../types/scripts.ts";
import {BrowserMessage} from "../types/browser.ts";

const scriptInjector = new ScriptHandler();

function applyLatestScripts(): void {
    chrome.storage.local.get(["entries"]).then((value) => {
        console.log('Latest Script applied', value.entries ? value.entries : []);

        if (value.entries) {
            Object.values(value.entries).forEach(entry => {
                scriptInjector.loadScript(entry as InjectedScript)
            })
        }
    })

}

if (window === top) {
    chrome.runtime.onMessage.addListener(async (message: BrowserMessage/*, sender*/) => {
        if (message.action === 'use') {
            switch (message.type) {
                case 'entry':
                    await scriptInjector.execute(message.id);
                    break;
                default:
                    console.warn('Unknown type received ', message);
            }
        } else {
            console.warn('Unknown action received ', message);
        }
    })



    console.log('Pathfinder Content Script integrated');
    applyLatestScripts();
}
