/**
 * @overview 文件描述
 * @author heykk
 */

import React, {PureComponent} from "react"
import {View, Text, StyleSheet, TouchableWithoutFeedback, Platform, Image,SafeAreaView} from "react-native"

export default class EmptyView extends PureComponent{

    render(){
        return (<View style={styles.container}>
            <Image style={styles.image} source={require('../../assets/no_data.png')}/>
            <Text style={styles.text}>暂无数据</Text>
        </View>)
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        paddingTop: 200
    },
    image:{
        // width: 80,
        // height:53
    },
    text: {
        alignSelf: 'center',
        marginTop:15,
        color:'#3C4348'
    }
})
