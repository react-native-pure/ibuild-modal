/**
 * @overview  层级选择组件
 * @author heykk
 */


import React from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import PageModal from './src/PageModal';
import {CascadeSelectorType, TransitionType} from "./config/Enums";
import {MainBackgroundColor} from "./config/DefaultTheme";
import {PageEmptyView} from './src/EmptyView';
import CascadeSelector, {dataSouceMapping} from './src/CascadeSelector';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MainBackgroundColor
    }
})

type TreeModalProps = {
    visible: boolean,
    title?: string,
    multiple?: boolean,
    historyKey: string,//提供一个字符串key用以保存历史选择数据以实现数据分离，如果不传的将使用默认key对历史选择数据进行保存
    selectedDataSouce?: Array,// 已选中数据
    lastSelectedPath?: Array,//上次选择的全路径，如果提供将自动跳到上次选择的位置
    type?: $Values<typeof CascadeSelectorType>,//只有当type==0时才支持多选
    maxLevel?: number,//页最多显示多少列，超过将按单列现实  type==1时，默认为1；type==0时，默认为10
    initLevel?: number,//初始化显示列 type==1时，默认为0；type==0时，默认为2
    onRequestClose: (selectedData?: Object[] | null) => void,
    onChanged: (path: Object[]) => void,
    dataSource: Array,
    keyName?: string,
    valueName?: string,
    transition: $Values<typeof TransitionType>,
    onShown?: Function,
    onHidden?: Function,
}

function TreeModal(props: TreeModalProps) {

    return (
        <PageModal visible={props.visible}
                   onRequestClose={props.onRequestClose}
                   transition={props.transition}
                   title={props.title}
                   onShown={props.onShown}
                   onHidden={props.onHidden}>
            <View style={styles.container}>
                {props.dataSource && props.dataSource.length > 0 &&
                <CascadeSelector maxListLevel={props.maxLevel}
                                 multiselect={props.multiple}
                                 initLevel={props.initLevel}
                                 historyKey={props.historyKey}
                                 lastSelectedPath={props.lastSelectedPath}
                                 type={props.model}
                                 onFinish={(selectedArray) => {
                                     props.onRequestClose(selectedArray)
                                 }}
                                 onChanged={props.onChanged}
                                 selectedDataSouce={dataSouceMapping(props.selectedDataSouce, props.keyName, props.valueName)}
                                 dataSource={dataSouceMapping(props.dataSource, props.keyName, props.valueName)}/>}
                {!props.dataSource && <PageEmptyView/>}
            </View>
        </PageModal>
    )
}

TreeModal.defaultProps = {
    visible: false,
    title: "请选择",
    multiple: false,
    maxLevel: 10,
    type: CascadeSelectorType.last,
    initLevel: 2,
    dataSource: [],
    keyName: "sysNo",
    valueName: "name",
    transition: TransitionType.horizontal
}

export default React.memo(TreeModal)

