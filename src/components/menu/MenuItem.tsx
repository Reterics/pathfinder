import {Link} from "react-router-dom";
import {MenuItemProps} from "../../types/ui.ts";


const MenuItem = (props: MenuItemProps) => {
    const py = props.dropdown ? 'py-1' : 'py-2';
    return (
        <li>
            <Link key={props.key}
                  className={
                    props.active ?
                        "block " + py + " px-3 rounded text-white bg-zinc-700" :
                        "block " + py + " px-3 rounded text-white hover:bg-zinc-700"
                  }
                  onClick={props.onClick}
                  to={props.path}>{props.name}</Link>
        </li>
    );
};

export default MenuItem;
