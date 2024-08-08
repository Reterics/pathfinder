import {Outlet, useLocation} from "react-router-dom";
import background from "../assets/background.png";
import logoBackground from "../assets/logo_background.png";
import logoWhite from "../assets/logo_white_48.png";
import MenuBar from "./menu/MenuBar.tsx";
import {MenuItemProps} from "../types/ui.ts";
import {useContext} from "react";
import {BrowserContext} from "./BrowserContext.ts";

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
        path: '/notes',
        name: 'Notes',
    },
    {
        path: '/about',
        name: 'About',
    }
];

const HeaderMenu = () => {
    const location = useLocation();
    const pathname = location.pathname === '/index.html' ? '/' : location.pathname;

    const context = useContext(BrowserContext);

    const homeEntries = (context?.data.entries || []).filter(entry => entry.onHome);
    const isWelcome = !homeEntries.length && pathname === '/';

    const menuItems: MenuItemProps[] = menu.map((m, index) => {
        return {
            key: 'menu_'+index,
            path: m.path,
            name: m.name,
            active: m.path === pathname
        } as MenuItemProps;
    });

    return (
        <div className={isWelcome ? 'h-[410px]' : pathname === '/' || pathname.startsWith('/editor/') ? 'h-auto' : 'h-[308px]'}>
        <img src={isWelcome ? logoBackground : background} className="absolute w-full pointer-events-none z-0 mt-[66px] object-none"
             style={{
                 height: '-webkit-fill-available',
                 objectFit: pathname === '/' ? 'none' : 'cover'
             }} alt="Background"/>
            <nav className={!isWelcome && pathname === '/' ? "bg-zinc-900 border-gray-200 min-w-[400px]" : "bg-zinc-900 border-gray-200 w-[690px]"}>
                <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://reterics.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logoWhite} className="h-8" alt="Pathfinder Logo"/>
                        {
                            (isWelcome || pathname !== '/') && <span
                                className="self-center text-2xl font-semibold whitespace-nowrap text-white">Pathfinder</span>
                        }
                    </a>
                    <MenuBar menu={menuItems}/>
                </div>
            </nav>
            {isWelcome && (
                <div className="absolute z-50 w-full text-center text-white m-4 flex flex-col gap-y-2 bottom-px">
                    <h1 className="text-xl font-bold pb-4">
                        How can we start the journey?
                    </h1>
                    <button type="button"
                            className="w-28 self-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-zinc-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-3">
                        Let's start
                    </button>
                </div>
            )}
            {!isWelcome && <Outlet/>}
        </div>
    )
}

export default HeaderMenu;
