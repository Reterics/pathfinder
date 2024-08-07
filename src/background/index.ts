console.log('Background loaded');

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "getQuerySelector",
        title: "Get Selector",
        contexts: ["all"]
    });
});

async function getElementQuerySelector(info: chrome.contextMenus.OnClickData) {
    console.error(info);
    const { lastSelector } = await chrome.storage.local.get(["lastSelector"]);
    console.error('Last Selector is: ', lastSelector);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getQuerySelector") {
        if (tab && tab.id)  {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getElementQuerySelector,
                args: [info]
            });
        }
    }
});
