import {useContext} from "react";
import {BrowserContext} from "../components/BrowserContext.ts";
import {ButtonProps} from "../types/ui.ts";
import PFButton from "../components/PFButton.tsx";


const HomePage = () => {
    const context = useContext(BrowserContext);

    const buttons: ButtonProps[] = (context?.data.entries || [])
        .filter(entry => entry.onHome)
        .map(entry => {
            return {
                content: entry.name,
                onClick: ()=>{} // send message to background to execute content-script
            } as ButtonProps
        })
    return (
        <div className="relative z-50 text-center text-white flex justify-end p-2 max-w-[693px] flex-wrap w-max">
            {buttons.map((button, i) =>
                (<PFButton {...button}
                           key={'button_' + i}
                           className='border-t border-b ms-1 me-1'/>))}
        </div>
    )
};

export default HomePage;
