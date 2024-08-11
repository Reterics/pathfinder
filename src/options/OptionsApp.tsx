import OptionsRouterConfig from "./OptionsRouterConfig.tsx";
import {BrowserProvider} from "../components/BrowserProvider.tsx";

function OptionsApp() {
    return (
        <BrowserProvider>
            <OptionsRouterConfig />
        </BrowserProvider>
    )
}

export default OptionsApp
