import React, {Component} from "react"
import {StyleSheet, View} from "react-native"
import PopModal from './PopModal';
import {Button,WhiteButtonStyles,FlatListPaging} from "@ibuild-community/react-native-applet";

type ListViewModelProps = {
    data:Array<any>,
    renderItem:() => React.ReactElement<any>,
    total:number,
    pageIndex:number,
    startPageNum?:number,
    onPageChange?:(pageIndex:number)=>void
} & ModalProps


export default class ListViewModel extends Component <ListViewModelProps>{

    static defaultProps = {
        visible: false,
        startPageNum:1
    };

    render() {
        return (
            <PopModal visible={this.props.visible}
                      onShown={this.props.onShown}
                      onHidden={this.props.onHidden}
                      onRequestClose={this.props.onRequestClose}>
                <View onStartShouldSetResponder={() => true}
                      style={[styles.container, this.props.style]}>
                    <FlatListPaging
                        style={{backgroundColor: "#fff", flex: 1}}
                        dataSource={this.props.data}
                        pageIndex={this.props.pageIndex}
                        totalRecords={this.props.total}
                        startPageNum={this.props.startPageNum}
                        pageSize={10}
                        onPageChange={this.props.onPageChange}
                        renderItem={this.props.renderItem}/>
                    <View style={{width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: '#e6e6e6'}}/>
                    <Button position="bottom" styles={WhiteButtonStyles} onPress={this.props.onRequestClose.bind(this)}>
                        取消
                    </Button>
                </View>
            </PopModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        height: 400
    },
    wheelPicker: {
        backgroundColor: "white",
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonText: {
        padding: 16
    }
})