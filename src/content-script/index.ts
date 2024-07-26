import {ScriptHandler} from "./ScriptHandler.ts";
import {InjectedScript} from "../types/scripts.ts";

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
chrome.runtime.onMessage.addListener((message) => {
    if (message.message === "scriptUpdate") {
        console.log("Received message", message);
        applyLatestScripts();
    }
});


console.log('Pathfinder Content Script integrated');
applyLatestScripts()
