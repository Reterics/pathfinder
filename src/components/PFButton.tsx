import {ButtonProps} from "../types/ui.ts";


const PFButton = (props: ButtonProps) => {

    let buttonClass = "px-4 py-2 text-sm font-medium text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white";

    if (props.className) {
        buttonClass += ' ' + props.className;
    }

    return (
        <button type="button"
                onClick={props.onClick}
                className={buttonClass}>
            {props.content}
        </button>
    )
};

export default PFButton;
