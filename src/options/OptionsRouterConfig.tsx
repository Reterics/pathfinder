import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import AboutPage from '../pages/AboutPage.tsx';
import NoPage from '../pages/NoPage.tsx';
import OptionsHeader from "./OptionsHeader.tsx";
import OptionsIndex from "./pages";

const QueryRouter = () => {
    const [searchParams] = useSearchParams();

    switch (searchParams.get('page')) {
        case 'about':
            return <AboutPage />;
        default:
            return <OptionsIndex />;
    }
}

const OptionsRouterConfig = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<OptionsHeader/>}>
                <Route index element={<QueryRouter />}/>
                <Route path="/options.html" element={<QueryRouter />}/>
                <Route path="*" element={<NoPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);

export default OptionsRouterConfig;
