/**
 * @overview 文件描述
 * @author heykk
 */

import React from 'react'
import {View, TouchableOpacity, StyleSheet, Text,Image} from 'react-native'
import {MainBuleColor} from '../../config/DefaultTheme'
import {TreeSelectorModel} from "../..//config/Enums";


type RadioCellProps = {
    onCellPress?: (item:any)=>void ,
    onRadioPress?:(item:any)=>void ,
    text: string,
    style:any ,
    data: Object,
    selected: boolean,
    showRadio: boolean,
    showArrow: boolean,
    textStyle: any,
    model:string,
}

export default class RadioCell extends React.PureComponent<RadioCellProps> {

    static defaultProps = {
        onCellPress: () => null,
        readOnly: false,
        value: "",
        model: TreeSelectorModel.singleSelectToEnd,
        textStyle: {}
    }

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
                {this.props.showRadio && <TouchableOpacity activeOpacity={1}
                                                           onPress={() => {
                                                               this.props.onRadioPress(this.props.data)
                                                           }}
                                                           style={{
                                                               paddingLeft: 5,
                                                               paddingVertical: 15
                                                           }}>
                    <Image style={{width:25,height:25,tintColor: this.props.selected ?this.selectTintColor:this.tintColor}}
                           source={this.props.selected ?require('../../assets/checkbox-blank-circle.png'):require("../../assets/checkbox-blank-circle-outline.png")}/>
                </TouchableOpacity>}
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
                    {this.props.showArrow && <TouchableOpacity activeOpacity={1}
                                                               onPress={() => {
                                                                   this.props.onCellPress(this.props.data)
                                                               }}
                                                               style={{
                                                                   paddingLeft: 5,
                                                                   paddingVertical: 15
                                                               }}>

                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: 'center'}}>
                            <Image  style={{tintColor:this.tintColor,width:8,height:13,marginTop: 2,marginRight:12}} source={require('../../assets/chevron-right.png')}/>
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
