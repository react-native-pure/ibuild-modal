/**
 * @overview 文件描述
 * @author heykk
 */


import {TransitionType} from "./Enums";
import React from "react";

export type NavigationBarStyle = {
    title:Object,
    leftButton:Object,
    rightButton:Object,
    contaner:Object
}



export type PageModalProps = {
    visible: boolean,
    onRequestClose: (data:Object | null)=>void,
    onShown?: Function,
    onHidden?: Function,
    children?: any,
    title?: string,
    transition?: $Values<typeof TransitionType>,  /**页码跳转动画，默认horizontal**/
    hiddenNavBar?: boolean, /**是否隐藏,默认不隐藏**/
    enabledGesture?: boolean,
    renderNavBar:() => React.ReactElement < any >,
}&NavigationHeaderProps


export type NavigationHeaderProps = {
    navbarStyle?:NavigationBarStyle,
    title?:string,
    onPressLeft?:()=>void,
    onPressRight?:()=>void,
    hiddenLeft?:boolean,
    hiddenRight?:boolean,
    renderLeft?:() => React.ReactElement < any >,
    renderRight?:() => React.ReactElement< any >
}
