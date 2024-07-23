import { createContext } from 'react';

interface ContextAPIInterface {
    chrome: typeof chrome
}

export const BrowserContext = createContext<ContextAPIInterface | null>(null);
