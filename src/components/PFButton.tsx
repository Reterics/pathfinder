import {ButtonProps} from "../types/ui.ts";
import {Link} from "react-router-dom";


const PFButton = (props: ButtonProps) => {
    if (props.to) {
        return (
            <Link to={props.to}
                  onClick={props.onClick}
                  className={'pf-button ' + (props.className || '')}>
                {props.content}
            </Link>
        )
    }

    return (
        <button type="button"
                onClick={props.onClick}
                className={'pf-button ' + (props.className || '')}>
            {props.content}
        </button>
    )
};

export default PFButton;
