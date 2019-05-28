/**
 * @overview 文件描述
 * @author heykk
 */


import {TreeSelectorModel, TransitionType} from "@react-native-pure/tree-modal/config/Enums";
import React from "react";
import PropTypes from "prop-types";

export type NavigationBarStyle = {
    title:Object,
    leftButton:Object,
    rightButton:Object,
    contaner:Object
}


export type TreeModalProps = {
    renderEmpty?:() => React.ReactElement < any >,
} & PageModalProps & TreeSelectorProps

export type TreeSelectorProps = {
    model: $Values<typeof TreeSelectorModel>,/**选择模式**/
    onChange?: (currentItem: Object,path:Object[]) => void,
    onSelected?: (currentItem: Object,path:Object[]) => void, /**多选时触发**/
    onUnSelected?: (currentItem: Object,path:Object[]) => void, /**多选取消时触发**/
    dataSource: Array,
    loadDataFuc?:(selectedItem:Object)=>Object, /**点击加载子级时触发**/
    keyExtractor?:(item: object) => string ,/**数据唯一标识，默认为sysNo**/
    labelExtractor?:(item: object) => string, /**显示文字的key,默认为name**/
    selectedDataSouce?: Array,/**已选中数据,多选时生效**/
    lastSelectedPath?: Array,/**最后选择的全路径，如果提供将自动跳到上次选择的位置**/
    maxLevel?: number,/**页最多显示多少列，超过将按单列现实  type==1时，默认为1；type==0时，默认为10**/
    initLevel?: number,/**初始化显示列 type==1时，默认为0；type==0时，默认为2**/
    storageKey: string,/**提供一个字符串key用以保存历史选择数据以实现数据分离，如果不传的将使用默认key对历史选择数据进行保存**/
    itemStyle?:Object,
    selectedItemStyle?:Object,
    style?:Object,
    onError?:(message)=>void,
    hiddenHomeIcon?:boolean, /**是否隐藏header上home Icon**/
    homeTitle?:string, /**初始化header 第一个位置的内容**/
    showFullValue?:boolean,  /**Item内容是否显示全路径**/
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
    renderLeftButton?:() => React.ReactElement < any >,
    renderRightButton?:() => React.ReactElement< any >
}
