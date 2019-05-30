/**
 * Created by kk on 2019/3/6.
 */

import React, {Component} from 'react'
import {ActivityIndicator, Animated, Dimensions, Easing, StyleSheet, View, Text} from 'react-native'
import Svg, {Rect, Path, RadialGradient, Stop, Defs, Ellipse} from "react-native-svg"
import {MainBuleColor} from '../../config/DefaultTheme';

const device = Dimensions.get('window');

export type QRScannerRectViewProps = {
    /**蒙层背景颜色**/
    maskColor?: string,
    /**扫描区转角线条颜色**/
    cornerColor?: string,
    /**border 颜色**/
    borderColor?: string,
    /**loading 颜色**/
    loadingColor: string,
    /**扫描区高度**/
    rectHeight?: number,
    /**扫描区宽度**/
    rectWidth?: number,
    /**扫描区border宽度**/
    borderWidth?: number,
    /**扫描区转角线条宽度**/
    cornerBorderWidth?: number,
    /**扫描去转角线条长度**/
    cornerBorderLength?: number,
    /**是否显示loading**/
    isLoading?: boolean,
    /**扫描线动画时间**/
    scanBarAnimateTime?: number,
    /**扫描线颜色**/
    scanBarColor?: string,
    /**扫描线margin**/
    scanBarMargin?: number,
    /**是否显示扫描线**/
    isShowScanBar?: boolean,
    /**扫描动画进行中**/
    scanning?: boolean,
    /**上部分提示文字**/
    topTipText?: string,
    /**下部分提示文字**/
    bottomTipText?: string
}

export default class QRScannerRectView extends Component<QRScannerRectViewProps> {
    static defaultProps = {
        maskColor: '#00000064',
        cornerColor: '#fff',
        borderColor: '#00000000',
        loadingColor: "#fff",
        rectHeight: 200,
        rectWidth: 200,
        borderWidth: 0,
        cornerBorderWidth: 2,
        cornerBorderLength: 20,
        isLoading: false,
        scanBarAnimateTime: 2500,
        scanBarColor: MainBuleColor,
        scanBarHeight: 1.5,
        scanBarMargin: 6,
        isShowScanBar: true,
        scanning: true,
        topTipText: "请将二维码放入扫描框中",
        bottomTipText: "扫描二维码"
    };

    constructor(props) {
        super(props);
        this.renderLoadingIndicator = this.renderLoadingIndicator.bind(this);
        this.lastAnimationFinish = true;
        this.state = {
            animatedValue: new Animated.Value(0),
            width: device.width,
            height: device.height,
        }
    }


    componentDidMount() {
        this.scannerLineMove();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scanning != this.props.scanning) {
            if (nextProps.scanning) {
                this.scannerLineMove();
            }
        }
    }

    get rectX() {
        return (this.state.width - this.props.rectWidth) / 2;
    }

    get rectY() {
        return (this.state.height - this.props.rectHeight) / 2;
    }

    /**
     * 蒙层
     * @returns {string}
     */
    get maskPoints() {

        /**Top**/
       let points = `M 0 0 L ${this.state.width} 0 L ${this.state.width} ${this.rectY} L 0 ${this.rectY}`
        /**Left**/
        points += `M 0 ${this.rectY} L ${this.rectX} ${this.rectY} L ${this.rectX} ${this.rectY + this.props.rectHeight} L 0 ${this.rectY + this.props.rectHeight}`
        /**right**/
        points += `M ${this.rectX + this.props.rectWidth} ${this.rectY} L ${this.state.width} ${this.rectY} L ${this.state.width} ${this.rectY + this.props.rectHeight} L ${this.rectX + this.props.rectWidth}  ${this.rectY + this.props.rectHeight}`
        /**bottom**/
        points += `M 0 ${this.rectY + this.props.rectHeight} L ${this.state.width} ${this.rectY + this.props.rectHeight} L ${this.state.width} ${this.state.height} L ${0}  ${this.state.height}`


        return points
    }

    /**
     * 四个角样式
     */
    get cornerPoints() {

        /**top left**/
        let points = `M ${this.rectX} ${this.rectY + this.props.cornerBorderLength} L ${this.rectX} ${this.rectY} L ${this.rectX + this.props.cornerBorderLength} ${this.rectY}`
        /**top right**/
        points += `M ${this.rectX + this.props.rectWidth - this.props.cornerBorderLength} ${this.rectY} L ${this.rectX + this.props.rectWidth} ${this.rectY} L ${this.rectX + this.props.rectWidth} ${this.rectY + this.props.cornerBorderLength}`
        /**bottom left**/
        points += `M ${this.rectX} ${this.rectY + this.props.rectHeight - this.props.cornerBorderLength } L ${this.rectX} ${this.rectY + this.props.rectHeight} L ${this.rectX + this.props.cornerBorderLength} ${this.rectY + this.props.rectHeight}`
        /**bottom right**/
        points += `M ${this.rectX + this.props.rectWidth - this.props.cornerBorderLength } ${this.rectY + this.props.rectHeight} L ${this.rectX + this.props.rectWidth} ${this.rectY + this.props.rectHeight} L ${this.rectX + this.props.rectWidth} ${this.rectY + this.props.rectHeight - this.props.cornerBorderLength }`
        return points;
    }

    scannerLineMove() {
        /**如果上一次动画没有执行完，则不开启新的动画**/
        if (!this.lastAnimationFinish) {
            return;
        }
        this.lastAnimationFinish = false;
        this.state.animatedValue.setValue(0);
        Animated.timing(this.state.animatedValue, {
            toValue: this.props.rectHeight,
            duration: this.props.scanBarAnimateTime,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            this.lastAnimationFinish = true;
            this.props.scanning && this.scannerLineMove()
        });
    }

    /**
     * 测量整个扫描组件的大小
     * @param e
     */
    measureTotalSize(e) {
        this.setState({
            width: e.layout.width,
            height: e.layout.height
        })
    }

    scanBarHeight(){
        return 1
    }

    /**
     * 绘制扫描线
     * @returns {*}
     * @private
     */
    _renderScanBar() {
        if (!this.props.isShowScanBar) return;
        return <View style={[styles.scanBar, {
            top: this.rectY,
            left: this.rectX,
            width: this.props.rectWidth,
            height: this.props.rectHeight
        }]}>
            <Animated.View
                style={[{transform: [{translateY: this.state.animatedValue}]}]}>
                <Svg height={this.props.rectHeight} width={this.props.rectWidth}>
                    <Defs>
                        <RadialGradient id="scanBar"
                                        cx={this.props.rectWidth / 2}
                                        cy={this.scanBarHeight}
                                        rx={this.props.rectWidth / 2 - this.props.scanBarMargin}
                                        ry={this.props.scanBarHeight}
                                        fx={this.props.rectWidth / 2}
                                        fy={this.scanBarHeight}
                                        gradientUnits="userSpaceOnUse">
                            <Stop offset="0"
                                  stopColor="#fff"
                                  stopOpacity="1"/>
                            <Stop offset="1"
                                  stopColor="#fff"
                                  stopOpacity="0"/>
                        </RadialGradient>
                    </Defs>
                    <Ellipse cx={this.props.rectWidth / 2}
                             cy={this.scanBarHeight}
                             rx={this.props.rectWidth / 2 - this.props.scanBarMargin}
                             ry={this.props.scanBarHeight}
                             fill="url(#scanBar)"/>
                </Svg>
            </Animated.View>
        </View>
    }

    /**
     * 渲染加载动画
     * @returns {*}
     */
    renderLoadingIndicator() {
        if (!this.props.isLoading) {
            return null
        }
        return (
            <View style={styles.indicator}>
                <ActivityIndicator
                    animating={this.props.isLoading}
                    color={this.props.loadingColor}
                    size='large'/>
            </View>
        );
    }

    renderTopTip() {
        return (
            <View style={[styles.topTip, {top: (this.state.height - this.props.rectHeight) / 2 - 60}]}>
                <Text style={styles.topTipText}>{this.props.topTipText}</Text>
            </View>
        )
    }

    renderBottomTop() {
        return (
            <View style={[styles.bottomTip, {top: this.state.height / 2 + this.props.rectHeight / 2 + 10}]}>
                <Text style={styles.bottomTipText}>{this.props.bottomTipText}</Text>
            </View>
        )
    }

    render() {
        return (
            <View
                onLayout={({nativeEvent: e}) => this.measureTotalSize(e)}
                style={[styles.container]}>
                <Svg height={this.state.height} width={this.state.width}>
                    <Path
                        d={this.maskPoints}
                        fill={this.props.maskColor}
                        stroke="none"/>
                    <Rect x={this.rectX}
                          y={this.rectY}
                          width={this.props.rectWidth}
                          height={this.props.rectHeight}
                          stroke={this.props.borderColor}
                          strokeWidth={this.props.borderWidth}
                          fill="none"/>
                    <Path d={this.cornerPoints}
                          fill="none"
                          stroke={this.props.cornerColor}
                          strokeWidth={this.props.cornerBorderWidth}/>
                </Svg>
                {this._renderScanBar()}
                {this.renderTopTip()}
                {this.renderLoadingIndicator()}
                {this.renderBottomTop()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
    },
    scanBar: {
        position: "absolute",
    },
    indicator: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topTip: {
        position: "absolute",
    },
    bottomTip: {
        position: "absolute",
    },
    topTipText: {
        color: '#fff',
        fontSize: 15
    },
    bottomTipText: {
        color: '#fff',
        fontSize: 13
    }
});
