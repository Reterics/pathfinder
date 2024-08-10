import {ReactNode} from "react";


export interface MenuItemProps {
    key: string,
    path: string,
    name: string,
    active?: boolean,
    onClick?: ()=>void,
    dropdown?: boolean
}

export interface MenuBarProps {
    menu: (MenuItemProps|MenuItemProps[])[];
}

export interface ButtonProps {
    onClick?: ()=>void,
    content?: string|ReactNode,
    className?: string,
    to?: string,
    children?: ReactNode,
}
export interface ButtonGroupProps {
    buttons: ButtonProps[],
}

export interface MenuDropdownProps {
    menu: MenuItemProps[]
}
