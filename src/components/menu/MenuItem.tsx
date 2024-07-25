import {Link} from "react-router-dom";
import {MenuItemProps} from "../../types/ui.ts";


const MenuItem = (props: MenuItemProps) => {
    return (
        <li>
            <Link key={props.key}
                  className={
                    props.active ?
                        "block py-2 px-3 rounded text-white bg-zinc-700" :
                        "block py-2 px-3 rounded text-white hover:bg-zinc-700"
                  }
                  to={props.path}>{props.name}</Link>
        </li>
    );
};

export default MenuItem;
