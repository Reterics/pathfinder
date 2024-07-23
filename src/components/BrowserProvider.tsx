import {BrowserContext} from "./BrowserContext.ts";
import {ReactNode} from "react";

export const BrowserProvider = ({ children }: {
    children: ReactNode
}) => {

    const contextAPI = {
        chrome: chrome
    };

    return (
        <BrowserContext.Provider value={contextAPI}>
            {children}
        </BrowserContext.Provider>
    )
};
