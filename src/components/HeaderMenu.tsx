import {Outlet, Link, useLocation} from "react-router-dom";

const menu = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/about',
        name: 'About',
    }
];

const HeaderMenu = () => {
    const location = useLocation();
    const { pathname } = location;

    return (
        <>
        <nav className="bg-gray-900 border-gray-200 w-[690px]">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://reterics.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../src/assets/logo_white_48.png" className="h-8" alt="Pathfinder Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Pathfinder</span>
                </a>
                <div className="block w-auto">
                    <ul className="font-medium flex p-0 rounded-lg flex-row space-x-4 rtl:space-x-reverse mt-0 bg-gray-900">
                        {menu.map((item, index) =>
                            item.path === pathname ?
                                (<li>
                                    <Link key={"menu-"+index}
                                          className="block py-2 px-3 rounded text-white bg-gray-700"
                                       to={item.path}>{item.name}</Link>
                                </li>)
                                : (<li>
                                    <Link key={"menu-" + index}
                                          className="block py-2 px-3 rounded text-white hover:bg-gray-700"
                                          to={item.path}>{item.name}</Link>
                                </li>)
                        )}

                    </ul>
                </div>
            </div>
        </nav>
        <Outlet />
        </>
    )
}

export default HeaderMenu;
