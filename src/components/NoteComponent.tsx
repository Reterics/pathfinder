import {FaPenToSquare} from "react-icons/fa6";
import {WebNoteProps} from "../types/db.ts";
import {FaTimes} from "react-icons/fa";
import {useState} from "react";


const NoteComponent = (props: WebNoteProps) => {

    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState(props.text);

    const toggleEditMode = () => {
        if (editMode) {
            props.update('text', text);
            setEditMode(false);
        } else {
            setEditMode(true);
        }
    }

    const themes = {
        default: "dark:bg-zinc-800 bg-white dark:border-zinc-700 border-zinc-400",
        pink: "bg-pink-300 border-pink",
        blue: "bg-blue-300 border-blue-300",
        yellow: "bg-yellow-400 border-yellow-400",
        red: "bg-red-300 border-red-300",
        gray: "bg-gray-300 dark:bg-gray-700 dark:border-gray-700 border-gray-300"
    };

    const themeClass = themes[props.theme || 'default'];

    const time = props.modified || props.created ? new Date(props.modified || props.created).toDateString() : '';

    const lines = (props.text || '').trim().split(/\n/g),
        title = lines.shift(),
        content = lines.join('\n');


    return (
        <div
            className={themeClass +
                " w-[320px] flex flex-col justify-between dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 me-2 mb-6 py-5 px-4"}>
            <div>
                {!editMode && <button className="relative top-0 right-0 float-right text-gray-800 dark:text-gray-100 cursor-pointer"
                    onClick={() => props.delete()}>
                    <FaTimes/>
                </button>}

                {!editMode && <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-3 text-sm">{title}</h4>}

                {!editMode && content && <p className="text-gray-800 dark:text-gray-100 text-sm">{content}</p>}

                {editMode && <textarea className="w-full font-bold mb-3 text-sm" value={text} onChange={(e) => setText(e.target.value)}/>}
            </div>
            <div>
                <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
                    <p className="text-sm">{time}</p>
                    <button
                        className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                        aria-label="edit note" role="button"
                        onClick={()=> toggleEditMode()}
                    >
                        <FaPenToSquare />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default NoteComponent;
