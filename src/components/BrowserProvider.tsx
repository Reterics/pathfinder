import {BrowserContext} from "./BrowserContext.ts";
import {ReactNode, useEffect, useState} from "react";
import {ContextData, ContextDataType} from "../types/context.ts";

export const BrowserProvider = ({ children }: {
    children: ReactNode
}) => {

    const [ctxData, setCtxData] = useState<ContextData>({
        entries: [],
        webNotes: []
    });


    const getContextData = async () => {
        const data = await chrome.storage.local.get(["entries", "webNotes"]);
        setCtxData(data as ContextData);
    }

    const updateContextData = async (key: string, value: unknown)=> {
        await chrome.storage.local.set({[key]:value});
        await getContextData();
    }

    const use = (id: number, type: ContextDataType)=> {
        console.log('Query tabs');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log('Active tabs: ', tabs);
            if (tabs && tabs.length > 0) {
                return chrome.tabs.sendMessage(tabs[0].id as number, {
                    type: type,
                    id: id,
                    action: 'use'
                });
            } else {
                console.warn('Failed to find active tab');
            }
        })
    }

    useEffect(() => {
        void getContextData();
    }, []);

    return (
        <BrowserContext.Provider value={{
            data: ctxData,
            setData: updateContextData,
            use: use
        }}>
            {children}
        </BrowserContext.Provider>
    )
};
