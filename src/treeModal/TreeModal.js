/**
 * @overview  层级选择组件
 * @author heykk
 */


import React from 'react'
import {
    StyleSheet,
    View
} from 'react-native'
import PageModal from '../pageModal/PageModal';
import {TreeSelectorModel, TransitionType} from "../../config/Enums";
import {MainBackgroundColor} from "../../config/DefaultTheme";
import EmptyView from './EmptyView';
import TreeSelector from './TreeSelector';
import {TreeModalProps} from '../../config/TreeModalTypes'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MainBackgroundColor
    }
})


function TreeModal(props: TreeModalProps) {
    return (
        <PageModal {...props}>
            <View style={styles.container}>
                {props.dataSource && props.dataSource.length > 0 &&
                <TreeSelector {...props}/>}
                {!props.dataSource && !!props.renderEmpty && props.renderEmpty()}
                {!props.dataSource && !props.renderEmpty && <EmptyView/>}
            </View>
        </PageModal>
    )
}

TreeModal.defaultProps = {
    visible: false,
    title: "请选择",
    multiple: false,
    maxLevel: 10,
    model: TreeSelectorModel.singleSelectToEnd,
    initLevel: 2,
    dataSource: [],
    keyExtractor: (data) => data.sysNo,
    labelExtractor: (data) => data.name,
    transition: TransitionType.horizontal,
}

export default React.memo(TreeModal)
