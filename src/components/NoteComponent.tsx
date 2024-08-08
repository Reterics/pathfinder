import {FaPenToSquare} from "react-icons/fa6";
import {WebNoteProps} from "../types/db.ts";


const NoteComponent = (props: WebNoteProps) => {

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

    const lines = (props.text || '').trim().split(/\n|(<br>)/g),
        title = lines.pop(),
        content = lines.join('<br>');

    return (
        <div
            className={themeClass +
                " w-[320px] flex flex-col justify-between dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 me-2 mb-6 py-5 px-4"}>
            <div>
                <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-3 text-sm">{title}</h4>
                {content && <p className="text-gray-800 dark:text-gray-100 text-sm">{content}</p>}

            </div>
            <div>
                <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
                    <p className="text-sm">{time}</p>
                    <button
                        className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                        aria-label="edit note" role="button">
                        <FaPenToSquare />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default NoteComponent;
