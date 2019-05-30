/**
 * @overview 滚轮选择器
 * @author jean.h.ma
 */

import React, {Component} from "react"
import WheelPicker from "@ibuild-community/react-native-wheel-picker"
import {StyleSheet, Text, TouchableHighlight, View} from "react-native"
import {get as getPath} from "object-path"
import PopModal from './PopModal'

const TEXT_COLOR = "#030303";
const UnderlayColor = "#f1f1f1";

type PickerData = {
    key: string,
    value: any,
};


/**WheelModal**/
export type WheelModalProps = ModalProps & {
    data: PickerData[],
    onRequestClose: (selectedValue?: any) => void,
    fontSize?: number,
    textOffset?: number,
    selectedIndex: number,
    onIndexChange?: (index: number, data: PickerData) => void,
}

export default class WheelModal extends Component<WheelModalProps> {
    static defaultProps = {
        visible: false,
        selectedIndex: 0,
        loop: false,
        fontSize: 20,
        textOffset: 0
    };

    get selectedValue() {
        return getPath(this.props.data, `${this.props.selectedIndex}.value`);
    }

    render() {
        return (
            <PopModal onRequestClose={() => {
                this.props.onRequestClose();
            }}
                      visible={this.props.visible}
                      onShown={this.props.onShown}
                      onHidden={this.props.onHidden}>
                <View style={styles.container}>
                    <View style={styles.buttonView}
                          onStartShouldSetResponder={() => true}>
                        <TouchableHighlight underlayColor={UnderlayColor}
                                            onPress={() => {
                                                this.props.onRequestClose();
                                            }}>
                            <Text style={styles.buttonText}>取消</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={UnderlayColor}
                                            onPress={() => {
                                                this.props.onRequestClose(JSON.parse(JSON.stringify(this.selectedValue)))
                                            }}>
                            <Text style={styles.buttonText}>确定</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{height: 200}}
                          onStartShouldSetResponder={() => true}>
                        <WheelPicker style={styles.wheelPicker}
                                     outerTextColor={TEXT_COLOR}
                                     centerTextColor={TEXT_COLOR}
                                     indicatorColor={TEXT_COLOR}
                                     onItemChange={this.props.onIndexChange}
                                     textOffset={this.props.textOffset}
                                     textSize={this.props.fontSize}
                                     datas={this.props.data.map(f => f.key)}
                                     currentIndex={this.props.selectedIndex}
                                     show={true}
                        />
                    </View>
                </View>
            </PopModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    wheelPicker: {
        backgroundColor: "white",
        height: 300,
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonText: {
        padding: 16
    }
})
