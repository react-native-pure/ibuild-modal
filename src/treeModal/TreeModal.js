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
import type {ModalProps} from "../..//config/Types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MainBackgroundColor
    }
})
export type TreeModalProps = {
    renderEmpty?:() => React.ReactElement < any >,
} & PageModalProps & TreeSelectorProps & ModalProps


export  default class TreeModal extends React.Component<TreeModalProps>{
    
    static defaultProps = {
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


    constructor(props){
        super(props)
        this.state = {
            data:null
        }
    }
    
    render(){
        return (
            <PageModal {...this.props}>
                <View style={styles.container}>
                    {this.props.dataSource && this.props.dataSource.length > 0 &&
                    <TreeSelector {...this.props}/>}
                    {!this.props.dataSource && !!this.props.renderEmpty && this.props.renderEmpty()}
                    {!this.props.dataSource && !this.props.renderEmpty && <EmptyView/>}
                </View>
            </PageModal>
        ) 
    }
}

