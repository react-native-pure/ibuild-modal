/**
 * @overview 文件描述
 * @author heykk
 */

import React from "react";
import {GalleryFileType} from '@react-native-pure/gallery/src/types';

export {GalleryFileType}


export type NavigationBarStyle = {
    title:Object,
    leftButton:Object,
    rightButton:Object,
    container:Object
}


export type ImageListPickerData = {
    /**
     * 图片/视频url地址
     */
    url: String,

    /**
     * 数据源类型
     */
    type: $Values<typeof GalleryFileType>,

    /**
     * 视频封面图地址
     */
    coverImageUrl?: String,
}


export type ModalProps = {
    visible: Boolean,
    onRequestClose: (value?: any) => void,
    onShown?:()=>void,
    onHidden?:()=>void,
    onWillHidden?:()=>void,
}

export type ImagePickerResult = {
    path: string;
    width: number;
    height: number;
    mime: string;
    size: number,
    modificationDate: string,
    dur?:number
};


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