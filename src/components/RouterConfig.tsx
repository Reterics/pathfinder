import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderMenu from './HeaderMenu';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import NoPage from './NoPage';

const RouterConfig = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HeaderMenu/>}>
                <Route index element={<HomePage/>}/>
                <Route path="about" element={<AboutPage/>}/>
                <Route path="*" element={<NoPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);

export default RouterConfig;
