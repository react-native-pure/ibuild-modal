/**
 * Created by yzw on 2018/5/8.
 * 扫描二维码
 */

import React, {PureComponent} from 'react'
import {StyleSheet, View, Vibration} from 'react-native'
import {RNCamera} from '@ibuild-community/react-native-camera';
import QRScannerRectView from './QRScannerRectView';
import {QRBarCodeEnum} from "@react-native-pure/ibuild-modal/config/Enums";
import {QRScannerRectViewProps} from "./QRScannerRectView";

export type QRScanViewProps = {
    barCodeTypes:$Values<typeof QRBarCodeEnum>[],
    onBarCodeRead: (data: Object) => void,
} &QRScannerRectViewProps


export default class QRScanView extends PureComponent <QRScanViewProps> {

    static defaultProps = {
        isLoading:false,
        barCodeTypes:null
    }
    constructor(props) {
        super(props);
        this.onScanResultReceived = this.onScanResultReceived.bind(this)
    }

    get scanning() {
        return !this.props.isLoading
    }

    onScanResultReceived(e) {
        if (!this.scanning) {
            return
        }
        Vibration.vibrate();
        this.props.onBarCodeRead && this.props.onBarCodeRead(e)
    }


    get barCodeTypes(){
        if(this.props.barCodeTypes && this.props.barCodeTypes.length>0){
            let types = [];
            this.props.barCodeTypes.forEach((item)=>{
                types.push(RNCamera.Constants.BarCodeType[item])
            })
            return {barCodeTypes:types};
        }
        return {};
    }

    render() {
        return (
           <View style={styles.container}>
                <RNCamera style={styles.camera}
                          ratio="1:1"
                          autoFocus={RNCamera.Constants.AutoFocus.on}
                          flashMode={RNCamera.Constants.FlashMode.auto}
                          onBarCodeRead={this.onScanResultReceived} {...this.barCodeTypes}/>

                {/*绘制扫描遮罩*/}
                <QRScannerRectView
                    scanning={this.scanning}
                    maskColor={this.props.maskColor}
                    cornerColor={this.props.cornerColor}
                    borderColor={this.props.borderColor}
                    rectHeight={this.props.rectHeight}
                    rectWidth={this.props.rectWidth}
                    borderWidth={this.props.borderWidth}
                    cornerBorderWidth={this.props.cornerBorderWidth}
                    cornerBorderLength={this.props.cornerBorderLength}
                    isLoading={this.props.isLoading}
                    scanBarAnimateTime={this.props.scanBarAnimateTime}
                    scanBarColor={this.props.scanBarColor}
                    scanBarMargin={this.props.scanBarMargin}
                    isShowScanBar={this.props.isShowScanBar}
                    topTipText={this.props.topTipText}
                    bottomTipText={this.props.bottomTipText}/>
           </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    camera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})
