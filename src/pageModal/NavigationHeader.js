/**
 * @overview 文件描述
 * @author heykk
 */

import React, {PureComponent} from "react"
import {View, Text, StyleSheet, TouchableWithoutFeedback, Platform, Image,SafeAreaView} from "react-native"
import {NavigationHeaderProps} from "../../config/TreeModalTypes";
import {get as getPath} from "object-path";

export default class NavigationHeader extends PureComponent<NavigationHeaderProps> {

    static defaultProps = {
        hiddenLeft:false,
        hiddenRight:false,
        title:"",
    }



    _renderLeftButton = ()=>{
        if(this.props.hiddenLeft){
            return  <View style={styles.leftButton}/>
        }
        if(this.props.renderLeft){
            return this.props.renderLeft()
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressLeft && this.props.onPressLeft()
            }}>
                <View style={[styles.leftButton]}>
                    <Image style={[styles.leftButtonImage,getPath(this.props.navbarStyle,"leftButton",null)]}
                           source={require("../../assets/back-icon/back-icon.png")}></Image>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderTitle = ()=>{
        return <Text style={[styles.title,getPath(this.props.navbarStyle,"title",null)]}>{this.props.title}</Text>
    }

    _renderRightButton = ()=>{
        if(this.props.hiddenRight){
            return  <View style={styles.rightButton}/>
        }
        if(this.props.renderRight){
            return this.props.renderRight()
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressRight && this.props.onPressRight()
            }}>
                <View style={styles.rightButton}>
                    <Text style={[ styles.rightButtonText,getPath(this.props.navbarStyle,"rightButton",null)]}>完成</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    get backgroundColor(){

        const container = StyleSheet.flatten(getPath(this.props.navbarStyle,"container",{}));
        if(container.backgroundColor){
            return container.backgroundColor
        }
        else{
            return "#fff"
        }
    }

    render(){
        return(<SafeAreaView style={{backgroundColor: this.backgroundColor}}>
            <View style={[styles.container,{backgroundColor:this.backgroundColor},getPath(this.props.navbarStyle,"container",null)]}>
            {this._renderLeftButton()}
            {this._renderTitle()}
            {this._renderRightButton()}
            </View>
        </SafeAreaView>)
    }
}

const  styles = StyleSheet.create({
    container:{
        ...Platform.select({
            ios: {
                height: 44
            },
            android:{
                height:56
            }
        }),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title:{
        color: "#3C4348",
        fontSize: 17,
        fontWeight:"bold"
    },
    leftButton:{
        width:80,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                height: 44
            },
            android:{
                height:56
            }
        }),
    },
    leftButtonImage:{
        marginLeft: 12,
        tintColor: '#3C4348'
    },
    rightButton:{
        width:80,
        justifyContent: 'center',
        alignItems:'flex-end',
        ...Platform.select({
            ios: {
                height: 44
            },
            android:{
                height:56
            }
        }),
    },
    rightButtonText:{
        color: "#3C4348",
        fontSize: 16,
        paddingHorizontal: 12
    }
})