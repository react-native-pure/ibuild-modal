import React, {Component} from "react"
import {ActionSheetIOS} from "react-native"
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
    cancelButton?:ActionSheetModalButton,
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

    componentWillReceiveProps( nextProps:Readonly<P> ) {
        if (nextProps.visible && this.props.visible !== nextProps.visible) {
            const options = {}
            options.title = nextProps.title

            const buttonTitiles = nextProps.buttons.map(( item, index ) => {
                if (item.isDelete) {
                    options.destructiveButtonIndex = index
                    options.titleColor = item.textColor ? item.textColor : 'red'
                }
                return item.text
            })

            if (nextProps.cancelButton) {
                buttonTitiles.push(nextProps.cancelButton.teamMember)
                if (nextProps.cancelButton.isDelete) {
                    options.destructiveButtonIndex = buttonTitiles.length - 1
                    options.titleColor = nextProps.cancelButton.isDelete.textColor ? nextProps.cancelButton.isDelete.textColor : 'red'
                } else {
                    options.cancelButtonIndex = buttonTitiles.length - 1
                }

            } else if (nextProps.cancelType === ActionSheetCancelButtonEnum.delete) {
                buttonTitiles.push("删除")
                options.destructiveButtonIndex = buttonTitiles.length - 1
                options.titleColor = 'red'
            } else if (nextProps.cancelType === ActionSheetCancelButtonEnum.cancel) {
                buttonTitiles.push("取消")
                options.cancelButtonIndex = buttonTitiles.length - 1
            }
            options.options = buttonTitiles
            ActionSheetIOS.showActionSheetWithOptions(options, ( buttonIndex ) => {
                console.log("index = ", buttonIndex)
                if (buttonIndex === buttonTitiles.length - 1 &&
                    (nextProps.cancelButton || nextProps.cancelType== ActionSheetCancelButtonEnum.delete || nextProps.cancelType === ActionSheetCancelButtonEnum.cancel)) {
                    if (nextProps.cancelButton) {
                        nextProps.cancelButton.onPress && nextProps.cancelButton.onPress()
                        nextProps.onRequestClose()
                    } else {
                        nextProps.onRequestClose()
                    }
                } else if (buttonIndex < this.props.buttons.length) {
                    const onPress = nextProps.buttons[buttonIndex].onPress
                    onPress && onPress()
                    nextProps.onRequestClose()
                }
            })
        }
    }

    render() {
        return null
    }
}
