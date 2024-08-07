import {ScriptHandler} from "./ScriptHandler.ts";
import {InjectedScript} from "../types/scripts.ts";
import {BrowserMessage} from "../types/browser.ts";

const script = document.createElement('script');
script.src = chrome.runtime.getURL('src/content-script/connector.js');
(document.head||document.documentElement).appendChild(script);
script.onload = function(): void {
    script.remove();
};


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


    document.addEventListener("contextmenu", (event) => {
        let element: HTMLElement | null = event.target as HTMLElement;
        const path: string[] = [];
        while (element) {
            let selector: string = element.nodeName.toLowerCase();
            if (element.id) {
                selector += `#${element.id}`;
                path.unshift(selector);
                break;
            } else {
                // TODO: Work on classnames as well
                let sibling = element;
                let nth = 1;
                while (sibling.previousElementSibling) {
                    sibling = sibling.previousElementSibling as HTMLElement;
                    if (sibling.nodeName.toLowerCase() === selector) {
                        nth++;
                    }
                }
                if (nth != 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            element = element.parentElement;
        }
        const lastSelector = path.join(" > ");
        chrome.storage.local.set({ lastSelector: lastSelector });
    });
}
