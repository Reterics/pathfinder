import {useContext, useEffect, useRef} from "react";
import {BrowserContext} from "../components/BrowserContext.ts";
import {InjectedScript} from "../types/scripts.ts";
import {useParams} from "react-router-dom";
import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import './EditorPage.css';
import PFButtonGroup from "../components/PFButtonGroup.tsx";
import {ButtonProps} from "../types/ui.ts";

const EditorPage = () => {
    const { scriptId } = useParams();
    const context = useContext(BrowserContext);

    const entry = (context?.data.entries || [])
        .find((entry: InjectedScript) => entry.id === Number(scriptId));

    const editorParentRef = useRef<HTMLDivElement|null>(null);
    const editorRef = useRef<EditorView | null>(null);

    const setEntry = () => {
        if (entry && editorRef.current && editorParentRef.current) {
            const rawText = (((editorParentRef.current as HTMLElement)
                .querySelector('.cm-content') as HTMLElement)
                .innerText || '')
                .replace(/\n{2}/g, '\n');

            // entry.content = rawText;
            const updatedEntries = context?.data.entries.map((entry) => {
                if (entry.id === Number(scriptId)) {
                    entry.content = rawText;
                }
                return entry;
            });
            context?.setData('entries', updatedEntries);
        }
    };

    useEffect(()=> {
        if (entry && editorParentRef.current) {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
            editorRef.current = new EditorView({
                extensions: [basicSetup, javascript()],
                parent: editorParentRef.current,
                doc: entry?.content,
            });
        }
    }, [entry])

    if (!entry) {
        return (
            <>Entry is not found: {scriptId}</>
        )
    }

    const buttons: ButtonProps[] = [
        {
            content: 'Save',
            onClick: setEntry
        },
    ];

    return (
        <div className="flex flex-col relative max-h-full">
            <div id="editor" ref={editorParentRef} className="relative overflow-x-auto shadow-md bg-zinc-300 bg-opacity-90"/>
            <div className="bg-white dark:bg-zinc-900 w-100 p-1 flex items-center justify-between flex-row-reverse">
                <PFButtonGroup buttons={buttons}/>
            </div>
        </div>
    )
};

export default EditorPage;
