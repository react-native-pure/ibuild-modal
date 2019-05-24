/**
 * @overview 文件描述
 * @author heykk
 */

import React, {PureComponent} from "react"
import {View, Text, StyleSheet, TouchableWithoutFeedback, Platform, Image,SafeAreaView} from "react-native"
// import PropTypes from "prop-types"
// import {connect} from "react-redux";
// import {changeSefetyModelSelected} from '../../ar/online.ar';
// import {HeaderColor} from "../../assets/default.theme";

//
// const whiteStyles = StyleSheet.create({
//     container: {
//         height: 44,
//         backgroundColor: "white"
//     },
//     titleView: {
//         flexDirection: "row",
//         alignItems: "center",
//         flex: 1,
//         justifyContent: "center",
//     },
//     title: {
//         color: "#3C4348",
//         fontSize: 17,
//         fontWeight:"bold"
//     },
//     buttons: {
//         ...Platform.select({
//             ios: {
//                 marginTop: getStatusBarHeight(),
//             }
//         }),
//         flex: 1,
//         flexDirection: "row",
//         justifyContent: "space-between"
//     },
//     leftButtons: {
//         flexDirection: "row",
//         alignItems: "center",
//         width:60
//     },
//     rightButtons: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "flex-end",
//         width:60
//     }
// });
//
// const styles = StyleSheet.create({
//     backView: {
//         ...Platform.select({
//             android: {
//                 width: 56,
//                 height: 56,
//                 justifyContent: "center",
//                 alignItems: "center"
//             },
//             ios: {
//                 width: 44,
//                 height: 44
//             }
//         })
//     },
//     back: {
//         tintColor: HeaderColor,
//         ...Platform.select({
//             ios: {
//                 marginVertical: 12,
//                 marginLeft: 10,
//                 width: 12,
//                 height: 20
//             }
//         })
//     }
// })
//
// const renderBackButton = headerProps => {
//     return (
//         <TouchableWithoutFeedback onPress={() => {
//             headerProps.navigation.goBack(headerProps.scene.route.key);
//         }}>
//             <View style={styles.backView}>
//                 <Image
//                     style={styles.back}
//                     source={require("../../assets/back-icon/back-icon.png")}></Image>
//             </View>
//         </TouchableWithoutFeedback>
//     );
// }
//
// /*支持多个按钮在title 位置*/
// @connect(({online}) => {
//     return {
//         selectedIndex: online.safetyModelNavIndex
//     };
// })
// export default class NavigationHeader extends PureComponent {
//     static propTypes = {
//         title: PropTypes.string,
//         styles: PropTypes.shape({
//             container: PropTypes.any
//         }),
//         /*title按钮数据，格式：{value:"xxx",selectedColor:'#xxx',color:'#xxx",selected:true (是否被选中)}*/
//         titleDatas: PropTypes.array,
//
//         /*点击title 上按钮的回调方法*/
//         titleViewCallBck: PropTypes.func,
//         renderLeftButtons: PropTypes.func,
//         renderRightButtons: PropTypes.func,
//         headerProps: PropTypes.object,
//         borderStyle:PropTypes.object
//     };
//
//     static defaultProps = {
//         styles: whiteStyles,
//         borderStyle:{},
//         renderLeftButtons: renderBackButton,
//         titleViewCallBck: () => {
//         }
//     };
//
//
//     constructor(props) {
//         super(props);
//     }
//
//
//     onPressTitle(index) {
//         this.props.dispatch(changeSefetyModelSelected(index))
//         this.props.titleViewCallBck(index)
//     }
//
//     render() {
//         return (
//             <View style={[this.props.styles.container,this.props.borderStyle]}>
//                 <View style={this.props.styles.buttons}>
//                     <View style={this.props.styles.leftButtons}>
//                         {this.props.renderLeftButtons(this.props.headerProps)}
//                     </View>
//
//                     <View style={this.props.styles.titleView}>
//                         {!this.props.titleDatas && <Text style={this.props.styles.title}>{this.props.title}</Text>}
//                         {!!this.props.titleDatas && this.props.titleDatas.map((item, index) => {
//                             return <TouchableWithoutFeedback key={index} onPress={this.onPressTitle.bind(this, index)}>
//                                 <View>
//                                     <Text style={{
//                                         fontWeight: 'bold',
//                                         paddingHorizontal: 8,
//                                         paddingVertical: 10,
//                                         fontSize: (this.props.selectedIndex == index) ?19:15,
//                                         color: (this.props.selectedIndex == index) ? item.selectedColor : item.color
//                                     }}>{item.value}</Text>
//                                 </View>
//                             </TouchableWithoutFeedback>
//                         })}
//                     </View>
//
//                     <View style={this.props.styles.rightButtons}>
//                         {this.props.renderRightButtons && this.props.renderRightButtons(this.props.headerProps)}
//                     </View>
//                 </View>
//             </View>
//         );
//     }
//
// }


type NavigationHeaderProps = {
    style?:any,
    title?:string,
    onPressLeft?:()=>void,
    onPressRight?:()=>void,
    hiddenLeft?:boolean,
    hiddenRight?:boolean,
    renderLeftButton?:() => React.ReactElement < any >,
    renderRightButton?:() => React.ReactElement< any >
}

export default class NavigationHeader extends PureComponent<NavigationHeaderProps> {

    static defaultProps = {
        hiddenLeft:false,
        hiddenRight:false,
        title:"",
    }



    _renderLeftButton = ()=>{
        if(this.props.renderLeftButton){
            return this.props.renderLeftButton()
        }
        return (
            <View>

            </View>
        )
    }

    _renderTitle = ()=>{
        return (
            <View>

            </View>
        )
    }

    _renderRightButton = ()=>{
        if(this.props.renderRightButton){
            return this.props.renderRightButton()
        }
        return (
            <View>

            </View>
        )
    }

    render(){
        return(<SafeAreaView style={[style.container,this.props.style]}>
            {this._renderLeftButton}
            {this._renderTitle}
            {this._renderRightButton}
        </SafeAreaView>)
    }
}

const  style = StyleSheet.create({
    container:{
        ...Platform.select({
            ios: {
                height: 44
            },
            android:{
                height:56
            }
        }),
        backgroundColor:'#fff'
    }
})