import {WebNote} from "../types/db.ts";

console.log('Background loaded');

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "getQuerySelector",
        title: "Get Selector",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "saveForLater",
        title: "Save for later",
        contexts: ["selection"]
    });
});

async function getElementQuerySelector(info: chrome.contextMenus.OnClickData) {
    console.error(info);
    const { lastSelector } = await chrome.storage.local.get(["lastSelector"]);
    console.error('Last Selector is: ', lastSelector);
}

async function saveForLater (info: chrome.contextMenus.OnClickData) {
    if (info.selectionText) {
        const storage = (await chrome.storage.local.get(["webNotes"])) as {webNotes: WebNote[]};

        const webNotes = storage && Array.isArray(storage.webNotes) ? storage.webNotes : [];

        const time = new Date().getTime();

        webNotes.push({
            id: 'wn_' + webNotes.length + time.toString(),
            url: info.pageUrl,
            text: info.selectionText,
            created: time,
            modified: time
        });

        await chrome.storage.local.set({webNotes: webNotes});
    }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getQuerySelector") {
        if (tab && tab.id)  {
            return  chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getElementQuerySelector,
                args: [info]
            });
        }
    } else if (info.menuItemId === "saveForLater") {
        return saveForLater(info);
    }
});
