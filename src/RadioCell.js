/**
 * @overview 文件描述
 * @author heykk
 */

/**
 * Created by yzw on 2018/3/28.
 */

import React from 'react'
import BaseComponent from '../BaseComponent'
import {View, TouchableOpacity, StyleSheet, Text,Image} from 'react-native'
import PropTypes from 'prop-types'
import {MainBuleColor} from '../config/DefaultTheme'
import {CascadeSelectorType} from "../config/Enums";

export default class RadioCell extends BaseComponent {
    static propTypes = {
        onCellPress: PropTypes.func,
        onNextPress: PropTypes.func,
        onRadioPress: PropTypes.func,
        text: PropTypes.string.isRequired,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        data: PropTypes.object,
        selected: PropTypes.bool,
        showRadio: PropTypes.bool,
        showArrow: PropTypes.bool,
        textStyle: PropTypes.object,
        type: PropTypes.number, // 0 cell左右均为往下级选择的操作，1 cell左边为选中，右边为往下级选的操作

    };
    static defaultProps = {
        onCellPress: () => null,
        readOnly: false,
        value: "",
        model: 0,
        textStyle: {}
    };

    constructor(props) {
        super(props)
        this.state = {}
    }

    get selectTintColor(){
        return MainBuleColor
    }

    get tintColor(){
        return '#ccc'
    }


    render() {

        return (
            <View style={[style.box, this.props.style]}>
                <TouchableOpacity activeOpacity={1}
                                  style={{
                                      flex: 1,
                                      justifyContent: 'center',
                                      paddingVertical: 15,
                                      paddingLeft: 15
                                  }}
                                  onPress={() => {
                                      this.props.onCellPress(this.props.data)
                                  }}>
                    <Text style={[{color: '#333',fontSize:14}, this.props.textStyle]}>{this.props.text}</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row'}}>
                    {this.props.showRadio && <TouchableOpacity activeOpacity={1}
                                                               onPress={() => {
                                                                   this.props.onRadioPress(this.props.data)
                                                               }}
                                                               style={{
                                                                   paddingLeft: 5,
                                                                   paddingVertical: 15
                                                               }}>


                        {this.props.showRadio && <Image style={{width:30,height:30,paddingRight: 10,tintColor: this.props.selected ?this.selectTintColor:this.tintColor}}
                                                        source={this.props.selected ?require('../assets/checkbox-blank-circle.png'):require("../assets/checkbox-blank-circle-outline.png")}/>}
                    </TouchableOpacity>}
                    {this.props.showArrow && <TouchableOpacity activeOpacity={1}
                                                               onPress={() => {
                                                                   if (this.props.type == CascadeSelectorType.any) {
                                                                       this.props.onNextPress(this.props.data)
                                                                   }
                                                                   else {
                                                                       this.props.onCellPress(this.props.data)
                                                                   }
                                                               }}
                                                               style={{
                                                                   paddingLeft: 5,
                                                                   paddingVertical: 15
                                                               }}>

                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'center'}}>
                            {this.props.type == CascadeSelectorType.any && <View style={{
                                height: 15,
                                width: 1,
                                backgroundColor: '#ccc'
                            }}/>}
                            <Image  style={{tintColor:this.tintColor,width:30,height:30,marginTop: 2}} source={require('../assets/chevron-right.png')}/>
                        </View>
                    </TouchableOpacity>}
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    box: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#999',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
