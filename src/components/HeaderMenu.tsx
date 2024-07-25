import {Outlet, useLocation} from "react-router-dom";
import background from "../assets/background.png";
import logoBackground from "../assets/logo_background.png";
import logoWhite from "../assets/logo_white_48.png";
import MenuBar from "./menu/MenuBar.tsx";
import {MenuItemProps} from "../types/ui.ts";

const menu = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/scripts',
        name: 'Scripts',
    },
    {
        path: '/about',
        name: 'About',
    }
];

const HeaderMenu = () => {
    const location = useLocation();
    const pathname = location.pathname === '/index.html' ? '/' : location.pathname;

    const menuItems: MenuItemProps[] = menu.map((m, index) => {
        return {
            key: 'menu_'+index,
            path: m.path,
            name: m.name,
            active: m.path === pathname
        } as MenuItemProps;
    });

    return (
        <>
        <img src={pathname === '/' ? logoBackground : background} className="absolute w-full pointer-events-none z-0 mt-[66px]"
             style={{
                 height: '-webkit-fill-available'
             }} alt="Background"/>
            <nav className="bg-zinc-900 border-gray-200 w-[690px]">
                <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://reterics.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logoWhite} className="h-8" alt="Pathfinder Logo"/>
                        <span
                            className="self-center text-2xl font-semibold whitespace-nowrap text-white">Pathfinder</span>
                    </a>
                    <MenuBar menu={menuItems} />
                </div>
            </nav>
            <Outlet/>
        </>
    )
}

export default HeaderMenu;
