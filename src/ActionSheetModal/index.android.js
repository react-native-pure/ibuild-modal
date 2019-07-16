import React, {Component} from "react"
import {StyleSheet, Text, TouchableOpacity, View} from "react-native"
import PopModal from '../PopModal';
import {SafeAreaView} from 'react-navigation'
import {ActionSheetCancelButtonEnum} from "../../config/Enums";
import type {ActionSheetModalButton, ModalProps} from "../../config/Types";

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
    title?:string,
    buttons:Array<ActionSheetModalButton>,
    style?:any,
    cancelType?:$Values<typeof ActionSheetCancelButtonEnum>,
    titleStyle?:any,
    buttonStyle?:any,
    cancelButton:?ActionSheetModalButton,
} & ModalProps;


/**
 * ActionSheetModal
 */
export default class ActionSheetModal extends Component<ActionSheetModalProps> {

    static defaultProps = {
        visible: false,
        buttons: [],
        cancelType: ActionSheetCancelButtonEnum.cancel,
    };

    _renderTitle() {
        if (!!this.props.title && this.props.title !== "") {
            return (
                <View style={styles.title}>
                    <Text style={[styles.titleText, this.props.titleStyle]}>{this.props.title}</Text>
                </View>
            );
        }
        return null;
    }

    _renderCancel() {
        const {cancelButton:{isDelete,text, onPress, textColor, textFontSize}={}} = this.props
        if (this.props.cancelType === ActionSheetCancelButtonEnum.delete || isDelete) {
            return (
                <TouchableOpacity onPress={onPress?onPress:this.props.onRequestClose}>
                    <View
                        style={[styles.delete, this.props.buttonStyle]}>
                        <Text
                            style={[styles.deleteText, textColor ? {color: textColor} : {color:"red"}, textFontSize ? {fontSize: textFontSize} : {}]}>{text ? text : "删除"}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (this.props.cancelType === ActionSheetCancelButtonEnum.cancel) {
            return (
                <TouchableOpacity onPress={onPress?onPress:this.props.onRequestClose}>
                    <View
                        style={[styles.delete, this.props.buttonStyle,]}>
                        <Text
                            style={[styles.cancelText, textColor ? {color: textColor} : {}, textFontSize ? {fontSize: textFontSize} : {}]}>{text ? text : "取消"}</Text>
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
                <SafeAreaView
                    style={[styles.container, this.props.style]}
                    onStartShouldSetResponder={() => {
                        return true
                    }}>
                    <View style={ styles.mainBackGroundColor}>
                        <View style={[styles.topView,]}>
                            {this._renderTitle()}

                            {this.props.buttons.map(( button:ActionSheetModalButton, index:number ) => {
                                return <TouchableOpacity key={index}
                                                         style={[styles.button, this.props.buttonStyle]}
                                                         onPress={() => {
                                                             button.onPress && button.onPress(index)
                                                         }}>
                                    <Text
                                        style={[styles.buttonText, button.textFontSize ? {fontSize: button.textFontSize} : {}, button.textColor ? {color: button.textColor} : {}]}>{button.text}</Text>
                                </TouchableOpacity>
                            })}
                        </View>
                        {this._renderCancel()}
                    </View>
                </SafeAreaView>

            </PopModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0)',
        marginHorizontal: 0,
    },
    mainBackGroundColor: {
        backgroundColor: '#F0F2F5'
    },
    transparentColor: {
        backgroundColor: "transparent"
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        height: 45,
    },
    titleText: {
        color: '#8B9098',
        fontSize: 14,
        textAlign: 'center'
    },
    topView: {
        overflow: 'hidden'
    },
    button: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    buttonText: {
        color: '#36393E',
        fontSize: 20
    },
    delete: {
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: 'red',
        fontSize: 20
    },
    cancelText: {
        color: '#36393E',
        fontSize: 20
    }
})