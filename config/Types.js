/**
 * @overview types
 * @author heykk
 */

import React from "react";

export type NavigationBarStyle = {
    title:Object,
    leftButton:Object,
    rightButton:Object,
    container:Object
}





export type ModalProps = {
    visible: boolean,
    onRequestClose: (value?: any) => void,
    onShown?:()=>void,
    /**
     * 关闭动画执行完成后
     */
    onHidden?:()=>void,
    /**
     * 关闭动画执行前
     */
    onWillHidden?:()=>void,
}




/**
 * @type
 * @property text - 按钮的名称
 * @property onPress - 按钮的点击事件
 */
export type ActionSheetModalButton = {
    text: string,
    onPress?: (index:number)=>void,
    /**android有效,ios只有删除按钮有效*/
    textColor?:string,
    /**android有效*/
    textFontSize?:number,
    /**是否是删除按钮，iOS必须设置**/
    isDelete?:boolean
};
