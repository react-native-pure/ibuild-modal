import React, {PureComponent} from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    Platform,
    SafeAreaView
} from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PageModal from './pageModal/PageModal';
import {ImageEditView} from "@ibuild-community/react-native-draw"
import {SafeAreaView as NaVSafeAreaView} from 'react-navigation'
import {ImageSourceEnum,TransitionType} from "../config/Enums";
import type {ImagePickerResult,ModalProps} from "../config/Types";


type ImageEditModalProps = {
    onRequestClose: (data: ImagePickerResult | null) => void,
    onPressBack: ()=>void,
    onError?: (error: Object)=>void,
    /**
     * 本地图片地址
     */
    path: string,
    /**图片来源**/
    sourceType: $Values< typeof ImageSourceEnum>,
    /**水印地址**/
    address?: string,
    /**
     * 页面切换动画方式
     */
    transition: $Values<typeof TransitionType>,

    /***
     * 隐藏水印
     */
    hiddenWaterMark?:boolean,

    /***
     * 隐藏文字编辑
     */
    hiddenTextrMark?:boolean,

    /**
     * 不可编辑图片,true时，水印和文字也不可以添加
     */
    disableEdit?:boolean

} & ModalProps;


export default class ImageEditModal extends PureComponent <ImageEditModalProps> {

    static defaultProps = {
        transition: TransitionType.vertical
    }

    constructor(props) {
        super(props);
        this.state = {
            navigationBarY: new Animated.Value(0),
        }
        this.hiddenNavBar = () => {
            Animated.timing(
                this.state.navigationBarY,
                {
                    toValue: -88,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start()
        }

        this.showNavBar = () => {
            Animated.timing(
                this.state.navigationBarY,
                {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ).start()
        }

        /**
         * 点击关闭
         */
        this.close = () => {
            this.props.onRequestClose()
        }

        /**
         * 点击返回
         */
        this.goBack = () => {
            this.props.onPressBack()
        }
    }


    render() {
        const canvasInfo = {...this.state.canvasInfo}
        if (!canvasInfo.localSourceImage || !canvasInfo.localSourceImage.filename) {
            canvasInfo.localSourceImage = null
        }
        return (
            <PageModal visible={this.props.visible}
                       hiddenNavBar={true}
                       transition={this.props.transition}
                       onHidden={this.props.onHidden}
                       onShown={this.props.onShow}
                       onRequestClose={this.props.onRequestClose}>
                <View style={styles.container}>
                    <NaVSafeAreaView style={{flex: 1}}>
                        <ImageEditView style={{flex: 1, backgroundColor: '#000'}}
                                       backgroundImagePath={this.props.path}
                                       onComposeEnd={(file) => {
                                           this.props.onRequestClose(file)
                                       }}
                                       onToolBarWillHidde={this.hiddenNavBar}
                                       onToolBarWillShow={this.showNavBar}
                                       hiddenWaterMark={this.props.hiddenWaterMark}
                                       hiddenTextrMark={this.props.hiddenTextrMark}
                                       disableEdit={this.props.disableEdit}
                        />
                    </NaVSafeAreaView>
                    <SafeAreaView style={styles.navBarSafeArea}>
                        <Animated.View style={[styles.navigationBar, {
                            transform: [{translateY: this.state.navigationBarY}]
                        }]}>
                            <TouchableOpacity style={styles.backBtn} onPress={this.goBack.bind(this)}>
                                <Icon name="arrow-left" color="#fff" size={30}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeBtn} onPress={this.close.bind(this)}>
                                <Icon name="close" color="#fff" size={30}/>
                            </TouchableOpacity>
                        </Animated.View>
                    </SafeAreaView>
                </View>
            </PageModal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        width: '100%',
    },
    navBarSafeArea: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0)',
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        ...Platform.select({
            ios: {
                height: 44,
            },
            android: {
                height: 56,
                paddingTop: 0
            }
        }),
    },
    backBtn: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    closeBtn: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})
