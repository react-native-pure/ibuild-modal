/**
 * @overview 文件描述
 * @author heykk
 */

import React, {PureComponent,useMemo} from "react"
import {View, Text, StyleSheet, TouchableWithoutFeedback, Platform, Image,SafeAreaView} from "react-native"
import {get as getPath} from "object-path";
import type {NavigationBarStyle} from "../../config/Types";
import {useSafeArea} from "react-native-safe-area-context";

export type NavigationHeaderProps = {
    navbarStyle?:NavigationBarStyle,
    title?:string,
    onPressLeft?:()=>void,
    onPressRight?:()=>void,
    hiddenLeft?:boolean,
    hiddenRight?:boolean,
    renderLeft?:() => React.ReactElement < any >,
    renderRight?:() => React.ReactElement< any >
}

function NavigationHeader(props: NavigationHeaderProps ) {
    const {hiddenLeft=false,hiddenRight = false,title="",renderLeft,onPressLeft,navbarStyle,renderRight,onPressRight} = props;
    const inset = useSafeArea()

    const renderLeftButton = ()=>{
        if(hiddenLeft){
            return  <View style={styles.leftButton}/>
        }
        if(renderLeft){
            return renderLeft()
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                onPressLeft && onPressLeft()
            }}>
                <View style={[styles.leftButton]}>
                    <Image style={[styles.leftButtonImage,getPath(props.navbarStyle,"leftButton",null)]}
                           source={require("../../assets/back-icon/back-icon.png")}></Image>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const renderTitle = ()=>{
        return <Text style={[styles.title,getPath(navbarStyle,"title",null)]}>{title}</Text>
    }

    const renderRightButton = ()=>{
        if(hiddenRight){
            return  <View style={styles.rightButton}/>
        }
        if(renderRight){
            return renderRight()
        }
        return (
            <TouchableWithoutFeedback onPress={() => {
                onPressRight && onPressRight()
            }}>
                <View style={styles.rightButton}>
                    <Text style={[ styles.rightButtonText,getPath(navbarStyle,"rightButton",null)]}>完成</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    const backgroundColor = useMemo(()=>{

        const container = StyleSheet.flatten(getPath(navbarStyle,"container",{}));
        if(container.backgroundColor){
            return container.backgroundColor
        }
        else{
            return "#fff"
        }
    },[navbarStyle])

    return(<View style={{backgroundColor: backgroundColor,paddingTop:inset.top}}>
        <View style={[styles.container,{backgroundColor:backgroundColor},getPath(navbarStyle,"container",null)]}>
            {renderLeftButton()}
            {renderTitle()}
            {renderRightButton()}
        </View>
    </View>)

}

export default React.memo(NavigationHeader)


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
        justifyContent: 'space-between',
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
