/**
 * Created by yzw on 2018/5/8.
 * 扫描二维码
 */

import React, {PureComponent} from 'react'
import {Vibration, View} from 'react-native'
import PageModal from './pageModal/PageModal';
import {TransitionType,QRBarCodeEnum} from "../config/Enums";
import QRScanView from "./basic/QRScanView";
import type {QRScannerRectViewProps} from "./basic/QRScannerRectView";
import NavigationHeader from './pageModal/NavigationHeader'
import type {ModalProps} from "../config/Types";

type QRScanModalProps =  {
    transition?: $Values<typeof TransitionType>,
    renderNavBar?: () => React.ReactElement<any>,
    barCodeTypes?: Array<$Values<typeof QRBarCodeEnum>>,
} & ModalProps & QRScannerRectViewProps

export default class QRScanModal extends PureComponent <QRScanModalProps> {

    static defaultProps = {
        isLoading: false,
        barCodeTypes: null,
        transition: TransitionType.horizontal,
    }

    constructor(props) {
        super(props);
        this.onShown = this.onShown.bind(this)
        this.onHidden = this.onHidden.bind(this)
        this.onScanResultReceived = this.onScanResultReceived.bind(this)
        this.state = {
            showCamera: false,
            mounted: false
        }
    }

    get scanning() {
        return this.props.visible && !this.props.isLoading
    }

    onShown() {
        this.props.onShow && this.props.onShow()
        this.setState({
            showCamera: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    mounted: true
                })
            }, 100)
        })
    }

    onHidden() {
        this.props.onHidden && this.props.onHidden()
        this.setState({
            showCamera: false
        }, () => {
            setTimeout(() => {
                this.setState({
                    mounted: false
                })
            }, 300)
        })
    }

    onScanResultReceived(e) {
        if (!this.scanning) {
            return
        }
        Vibration.vibrate();
        this.props.onRequestClose && this.props.onRequestClose(e)
    }

    renderNavBar() {
        if (this.props.renderNavBar) {
            return this.props.renderNavBar()
        }
        return (
            <View style={[{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {backgroundColor: this.state.mounted ? 'rgba(0,0,0,0)' : '#000'}]}>
                <NavigationHeader hiddenRight={true}
                                  navbarStyle={{
                                      container: {
                                          backgroundColor: 'rgba(0,0,0,0)'
                                      },
                                      leftButton: {
                                          tintColor: '#fff'
                                      }
                                  }}
                                  onPressLeft={() => {
                                      this.props.onRequestClose()
                                  }}/>
            </View>
        )
    }

    render() {
        return (
            <PageModal style={{flex: 1}}
                       onShown={this.onShown}
                       onHidden={this.onHidden}
                       hiddenNavBar={true}
                       transition={this.props.transition}
                       visible={this.props.visible}
                       onRequestClose={() => {
                           this.props.onRequestClose()
                       }}>
                {this.state.showCamera && <QRScanView {...this.props}
                                                      onBarCodeRead={this.onScanResultReceived}/>}
                {this.props.transition != TransitionType.none && this.renderNavBar()}

            </PageModal>
        )
    }
}
