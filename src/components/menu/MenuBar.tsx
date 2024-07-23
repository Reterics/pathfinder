import {MenuBarProps} from "../../types/ui.ts";
import MenuItem from "./MenuItem.tsx";


const MenuBar = (props: MenuBarProps) => {
    return (
        <div className="block w-auto">
            <ul className="font-medium flex p-0 rounded-lg flex-row space-x-4 rtl:space-x-reverse mt-0">
                {props.menu.map((item) =>
                    <MenuItem {...item} />
                )}
            </ul>
        </div>
    );
};

export default MenuBar;
