import {useContext, useEffect, useState} from "react";
import {BrowserContext} from "../components/BrowserContext.ts";
import {InjectedScript} from "../types/scripts.ts";
import {useParams} from "react-router-dom";


const EditorPage = () => {
    const { scriptId } = useParams();
    const context = useContext(BrowserContext);
    const [entry, setEntry] = useState<InjectedScript>({
        keyBind: '',
        origin: '',
        content: '',
        id: 0,
        name: ''
    });


    const loadEntriesFromStore = async ()=>{
        if (!context) return;

        const { entries } = await context.chrome.storage.local.get(["entries"]);

        const _entry = entries.find((entry: InjectedScript) => entry.id === Number(scriptId));
        setEntry(_entry);
    }

    useEffect(()=> {
        void loadEntriesFromStore();
    }, []);

console.error(entry);
    return (
        <>
            This will be an editor
        </>
    )
};

export default EditorPage;
