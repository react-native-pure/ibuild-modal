/**
 * @overview 文件描述
 * @author heykk
 */


import {TreeSelectorModel, TransitionType} from "./Enums";
import React from "react";
import PropTypes from "prop-types";
import {PageModalProps} from './PageModalTypes'



export type TreeModalProps = {
    renderEmpty?:() => React.ReactElement < any >,
} & PageModalProps & TreeSelectorProps


export type TreeSelectorData = {
    key:string,
    value:string,
    children:Array<TreeSelectorData>,
    haveChildren:boolean,
    data:Object
}
export type TreeSelectorProps = {
    model: $Values<typeof TreeSelectorModel>,/**选择模式**/
    onChange?: (currentItem: Object) => void,
    onSelected?: (currentItem: Object) => void, /**多选时触发**/
    onUnSelected?: (currentItem: Object) => void, /**多选取消时触发**/
    dataSource: Array<Object>,
    selectedDataSouce: Array<Object>,/**已选中数据,多选时生效**/
    loadDataFuc?:(selectedItem:Object)=>Object, /**点击加载子级时触发**/
    keyExtractor?:(item: object) => string ,/**数据唯一标识，默认为sysNo**/
    labelExtractor?:(item: object) => string, /**显示文字的key,默认为name**/
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


