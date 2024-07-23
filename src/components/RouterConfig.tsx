import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderMenu from './HeaderMenu';
import HomePage from '../pages/HomePage.tsx';
import AboutPage from '../pages/AboutPage.tsx';
import NoPage from '../pages/NoPage.tsx';
import ScriptsPage from "../pages/ScriptsPage.tsx";

const RouterConfig = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HeaderMenu/>}>
                <Route index element={<HomePage/>}/>
                <Route path="/index.html" element={<HomePage/>}/>
                <Route path="about" element={<AboutPage/>}/>
                <Route path="scripts" element={<ScriptsPage/>}/>
                <Route path="*" element={<NoPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);

export default RouterConfig;
