import React, {Component} from "react"
import {StyleSheet, Text, TouchableOpacity, View} from "react-native"
import PopModal from './PopModal';
import {SafeAreaView} from 'react-navigation'
import {ActionSheetCancelButtonEnum} from "../config/Enums";
import type {ActionSheetModalButton} from "../config/Types";

/**
 * @alias ActionSheetModal.propTypes
 * @type
 * @property visible - 是否显示ActionSheetModal
 * @property title - 标题
 * @property buttons - 按钮
 * @property style - 样式
 * @property onCancel - 隐藏ActionSheetModal时调用
 * @property cancelType - 隐藏类型
 */
type ActionSheetModalProps = {
    title?: string,
    buttons: Array<ActionSheetModalButton>,
    style?: any,
    cancelType?: $Values< typeof ActionSheetCancelButtonEnum>
} & ModalProps;

/**
 * ActionSheetModal
 */
export default class ActionSheetModal extends Component<ActionSheetModalProps> {

    static defaultProps = {
        visible: false,
        buttons: [],
        cancelType: ActionSheetCancelButtonEnum.cancel
    };

    _renderTitle() {
        if (this.props.title) {
            return (
                <View style={styles.title}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
            );
        }
        return null;
    }

    _renderCancel() {
        if (this.props.cancelType === ActionSheetCancelButtonEnum.delete) {
            return (

                <TouchableOpacity onPress={this.props.onCancel}>
                    <View style={styles.delete}>
                        <Text style={styles.deleteText}>删除</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        else if (this.props.cancelType === ActionSheetCancelButtonEnum.cancel) {
            return (
                <TouchableOpacity onPress={this.props.onRequestClose}>
                    <View style={styles.delete}>
                        <Text style={styles.cancelText}>取消</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return null;
    }

    render() {
        return (
            <PopModal visible={this.props.visible}
                      onShown={this.props.onShown}
                      onHidden={this.props.onHidden}
                      onRequestClose={this.props.onRequestClose}>
                <SafeAreaView style={[styles.container, this.props.style]}
                      onStartShouldSetResponder={() => {
                          return true
                      }}>
                    <View style={styles.topView}>
                    {this._renderTitle()}

                    {this.props.buttons.map((button: ActionSheetModalButton, index: number) => {
                        return <TouchableOpacity key={index}
                                                 style={styles.button}
                                                 onPress={()=>{
                                                     button.onPress && button.onPress(index)
                                                 }}>
                            <Text style={styles.buttonText}>{button.text}</Text>
                        </TouchableOpacity>
                    })}
                    </View>
                    {this._renderCancel()}
                </SafeAreaView>

            </PopModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingBottom:20
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    titleText: {
        color: '#3C4348',
        fontSize: 16,
        fontWeight: 'bold'
    },
    topView:{
        borderRadius:8,
        marginHorizontal:15,
        overflow:'hidden'
    },
    button: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    buttonText: {
        color: '#3C4348',
        fontSize: 16
    },
    delete: {
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:15,
        borderRadius:8,
    },
    deleteText: {
        color: 'red',
        fontSize: 16
    },
    cancelText: {
        color: '#3C4348',
        fontSize: 16
    }
})