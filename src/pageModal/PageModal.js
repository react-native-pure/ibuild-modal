/**
 * @overview 文件描述
 * @author heykk
 */


import React, {PureComponent} from "react"
import {
    Animated,
    Modal,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native"
import {TransitionType} from "../../config/Enums";
import NavigationHeader from "./NavigationHeader";
import {HeaderColor} from "../../config/DefaultTheme";
import {PanGestureHandler} from 'react-native-gesture-handler';
import type {ModalProps} from "../../config/Types";
import type {NavigationHeaderProps} from "./NavigationHeader";

const deviceSize = Dimensions.get('window')

/**
 * @alias PageModalProps.propTypes
 * @type
 * @property visible - 是否显示
 * @property onRequestClose - 请求关闭modal时回调
 * @property onShown - modal显示后回调,回调会在动画之后执行
 * @property onHidden - modal关闭后回调,回调会在动画之后执行
 * @property title - 顶部title
 * @property transition - 切换方式（水平和垂直）
 * @property hiddenNavBar - 隐藏导航栏
 * @property enabledGesture - 是否支持滑动关闭手势
 *
 */
export type PageModalProps = {
    onRequestClose: (data:any | null)=>void,
    children?: any,
    title?: string,
    transition?: $Values<typeof TransitionType>,  /**页码跳转动画，默认horizontal**/
    hiddenNavBar?: boolean, /**是否隐藏,默认不隐藏**/
    enabledGesture?: boolean,
    renderNavBar:() => React.ReactElement < any >,
}&NavigationHeaderProps & ModalProps


export default class PageModal extends PureComponent<PageModalProps> {

    static defaultProps = {
        visible: false,
        transition: TransitionType.horizontal,
        title: "",
        hiddenNavBar: false,
        enabledGesture: true
    };

    constructor(props) {
        super(props);
        this._duration = 250;
        this._mounted = false;
        this._onGestureEvent = this._onGestureEvent.bind(this);
        this._openingHandlerStateChange = this._openingHandlerStateChange.bind(this);
        this.state = {
            enabledGesture: props.transition === TransitionType.horizontal ? props.enabledGesture : false,
            visible: props.visible,
            translateY: new Animated.Value(this.hiddenTranslateY(props)),
            translateX: new Animated.Value(this.hiddenTranslateX(props)),
            contentVisible: props.visible //为了解决modal动画和useNativeDriver同时使用，modal消失后页面会闪一下的问题
        };
    }

    componentDidMount() {
        this._mounted = true;
        if (this.props.visible) {
            this.show()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && this.state.visible !== nextProps.visible) {
            nextProps.visible ? this.show() : this.hidden()
        }
    }

    get showTranslateY() {
        return 0;
    }

    get showTranslateX() {
        return 0
    }

    hiddenTranslateX(props) {
        switch (props.transition) {
            case TransitionType.vertical:
                return 0;
            case TransitionType.horizontal:
                return deviceSize.width;
            default:
                return 0;
        }
    }

    hiddenTranslateY(props) {
        switch (props.transition) {
            case TransitionType.vertical:
                return deviceSize.height;
            case TransitionType.horizontal:
                return 0;
            default:
                return 0;
        }
    }

    show(duration = this._duration, fromOrg = true) {
        if (!this._mounted) {
            return
        }
        this.setState({
            visible: true,
            contentVisible: true
        }, () => {
            if (fromOrg) {
                this.state.translateY.setValue(this.hiddenTranslateY(this.props))
                this.state.translateX.setValue(this.hiddenTranslateX(this.props))
            }

            let animations = [];
            let translateY = this.showTranslateY;
            let translateX = this.showTranslateX;
            if (translateY !== this.state.translateY) {
                animations.push(
                    Animated.timing(
                        this.state.translateY,
                        {
                            toValue: this.showTranslateY,
                            duration: duration,
                            useNativeDriver: true
                        }
                    )
                )
            }
            if (translateX !== this.state.translateX) {
                animations.push(
                    Animated.timing(
                        this.state.translateX,
                        {
                            toValue: this.showTranslateX,
                            duration: duration,
                            useNativeDriver: true
                        }
                    )
                )
            }

            Animated.parallel(animations).start(() => {
                this.props.onShown && this.props.onShown()
            });
        });
    }

    hidden(duration = this._duration) {
        if (!this._mounted) {
            return
        }
        this.props.onWillHidden && this.props.onWillHidden()
        let translateY = this.showTranslateY;
        let translateX = this.showTranslateX;

        let animations = [];
        if (translateY !== this.state.translateY) {
            animations.push(
                Animated.timing(
                    this.state.translateY,
                    {
                        toValue: this.hiddenTranslateY(this.props),
                        duration: duration,
                        useNativeDriver: true
                    }
                )
            )
        }
        if (translateX !== this.state.translateX) {
            animations.push(
                Animated.timing(
                    this.state.translateX,
                    {
                        toValue: this.hiddenTranslateX(this.props),
                        duration: duration,
                        useNativeDriver: true
                    }
                )
            )
        }
        Animated.parallel(animations).start(() => {
            if (this._mounted) {
                this.setState({
                    contentVisible: false
                }, () => {
                    this.setState({
                        visible: false
                    }, () => {
                        this.props.onHidden && this.props.onHidden();
                    })
                })
            }
        });
    }

    _onGestureEvent = ({nativeEvent})=> {
        const translationX = nativeEvent.translationX
        this.state.enabledGesture && this.state.translateX.setValue(translationX)
    }

    _openingHandlerStateChange =({nativeEvent})=> {
        if (!this.state.enabledGesture) {
            return
        }
        const {state, translationX, velocityX} = nativeEvent;
        if (state === 5) {
            if (velocityX > 0) {
                this.props.onRequestClose && this.props.onRequestClose()
            } else {
                let time = deviceSize.width / this._duration * (deviceSize.width - translationX)
                this.show(time, false)
            }
        }
    }

    renderNavBar() {
        const {onPressLeft, onRequestClose, renderNavBar, ...props} = this.props
        if (renderNavBar) {
            return renderNavBar()
        }
        return <NavigationHeader  {...props}
                                  onPressLeft={() => {
            onPressLeft && onPressLeft()
            onRequestClose && onRequestClose()
        }}
                                />
    }

    render() {
        return (
            <Modal visible={this.state.visible}
                   animationType={"none"}
                   onRequestClose={() => {
                       this.props.onRequestClose && this.props.onRequestClose()
                   }}
                   transparent={true}>
                {this.state.contentVisible && <PanGestureHandler
                    activeOffsetX={0}
                    hitSlop={{left: 0, width: 20}}
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._openingHandlerStateChange}
                    enabled={this.state.enabledGesture}>
                    <Animated.View style={[styles.container, {
                        transform: [{translateX: this.state.translateX}, {translateY: this.state.translateY}],
                    }]}>
                        {!this.props.hiddenNavBar && this.renderNavBar()}
                        {this.props.children}
                    </Animated.View>
                </PanGestureHandler>}
            </Modal>
        )
    }

    componentWillUnmount() {
        this._mounted = false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backView: {
        ...Platform.select({
            android: {
                width: 56,
                height: 56,
                justifyContent: "center",
                alignItems: "center"
            },
            ios: {
                width: 44,
                height: 44
            }
        })
    },
    back: {
        tintColor: HeaderColor,
        ...Platform.select({
            ios: {
                marginVertical: 12,
                marginLeft: 10,
                width: 12,
                height: 20
            }
        })
    },
})
