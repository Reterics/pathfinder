

export interface MenuItemProps {
    key: string,
    path: string,
    name: string,
    active?: boolean
}

export interface MenuBarProps {
    menu: MenuItemProps[];
}
