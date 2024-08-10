import {MenuDropdownProps} from "../../types/ui.ts";
import MenuItem from "./MenuItem.tsx";
import {useState} from "react";


const MenuDropDown = (props: MenuDropdownProps) => {

    const [open, setOpen] = useState(false);

    return (
        <li>
            <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between w-full py-2 px-3 text-zinc-900 rounded hover:bg-zinc-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-zinc-700 dark:hover:bg-zinc-700 md:dark:hover:bg-transparent">
                Dropdown
                <svg
                className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m1 1 4 4 4-4"/>
            </svg></button>
            {open && <div
                 className="absolute z-50 font-normal bg-white divide-y divide-zinc-100 rounded-lg shadow w-44 dark:bg-zinc-700 dark:divide-zinc-600">
                <ul className="py-1 text-sm text-zinc-700 dark:text-zinc-400" >
                    {props.menu.map((menu) => <MenuItem
                        {...menu}
                        onClick={() => setOpen(false)}
                        dropdown={true}
                    /> )}
                </ul>
            </div>}
        </li>
    );
};

export default MenuDropDown;
