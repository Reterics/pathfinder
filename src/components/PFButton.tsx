import {ButtonProps} from "../types/ui.ts";
import {Link} from "react-router-dom";


const PFButton = (props: ButtonProps) => {
    if (props.to) {
        return (
            <Link to={props.to}
                  onClick={props.onClick}
                  className={'pf-button ' + (props.className || '')}>
                {props.content}
                {props.children}
            </Link>
        )
    }

    return (
        <button type="button"
                onClick={props.onClick}
                className={'pf-button ' + (props.className || '')}>
            {props.content}
            {props.children}
        </button>
    )
};

export default PFButton;
