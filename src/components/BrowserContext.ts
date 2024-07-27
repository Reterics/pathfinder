import { createContext } from 'react';
import {ContextAPI} from "../types/context.ts";


export const BrowserContext = createContext<ContextAPI | null>(null);
