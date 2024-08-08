import {useContext} from "react";
import {BrowserContext} from "../components/BrowserContext.ts";
import {useDebouncedCallback} from "use-debounce";
import {WebNote, WebNoteKey} from "../types/db.ts";
import NoteComponent from "../components/NoteComponent.tsx";


const NotesPage = () => {
    const context = useContext(BrowserContext);

    const webNotes = context?.data.webNotes || [];
    const setWebNotes = (data: WebNote[]) => {
        context?.setData('webNotes', data);
    };

    const updateWebNote = useDebouncedCallback((index: number, key: WebNoteKey, value: string|number) => {
        setWebNotes(webNotes.map((webNote, _index) => {
            if (_index === index) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                webNote[key] = value;
            }
            return webNote;
        }));
    }, 1000);

    const deleteWebNote = (index: number) => {
        setWebNotes(webNotes.filter((_entry, _index) => {
            return _index !== index;
        }));
    };

    return (
        <div className="py-2 px-2 relative">
            <div className="flex flex-wrap">
                {
                    webNotes.map((webNote, index) =>
                        <NoteComponent
                            {...webNote}
                            delete={()=>deleteWebNote(index)}
                            update={(key: WebNoteKey, value: string|number) => updateWebNote(index, key, value) as unknown}
                        />)
                }
            </div>
        </div>
    );
};

export default NotesPage;
