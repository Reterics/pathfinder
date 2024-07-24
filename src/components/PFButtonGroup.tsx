import {ButtonGroupProps} from "../types/ui.ts";
import PFButton from "./PFButton.tsx";


const PFButtonGroup = (props: ButtonGroupProps) => {
    return (
        <div className="inline-flex rounded-md shadow-sm" role="group">
            {props.buttons.map((button, i) =>
                (<PFButton {...button}
                           key={'button_' + i}
                           className={!i ?
                               'border rounded-s-lg' : props.buttons.length-1 === i
                                   ? 'border rounded-e-lg' :'border-t border-b'}/>))}
        </div>
    )
};

export default PFButtonGroup;
