import {BrowserContext} from "./BrowserContext.ts";
import {ReactNode, useEffect, useState} from "react";
import {ContextData} from "../types/context.ts";

export const BrowserProvider = ({ children }: {
    children: ReactNode
}) => {

    const [ctxData, setCtxData] = useState<ContextData>({
        entries: []
    });


    const getContextData = async () => {
        const data = await chrome.storage.local.get(["entries"]);
        setCtxData(data as ContextData);
    }

    const updateContextData = async (key: string, value: unknown)=> {
        await chrome.storage.local.set({[key]:value});
        await getContextData();
    }

    useEffect(() => {
        void getContextData();
    }, []);

    return (
        <BrowserContext.Provider value={{
            data: ctxData,
            setData: updateContextData
        }}>
            {children}
        </BrowserContext.Provider>
    )
};
