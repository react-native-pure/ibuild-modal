import React, {Component} from "react"
import {Animated, Modal, StyleSheet, TouchableWithoutFeedback} from "react-native"

/**
 * @alias PopModal.propTypes
 * @type
 * @property visible - 是否显示
 * @property onRequestClose - 请求关闭modal时回调
 * @property onShown - modal显示后回调,回调会在动画之后执行
 */
type PopModalProps = {
    visible: boolean,
    onRequestClose: Function,
    onShown?: Function,
    onHidden?: Function,
    children?: any
};

/**
 * 从App底部弹出的Modal
 * @author jean.h.ma
 */
export default class PopModal extends Component<PopModalProps> {
    static defaultProps = {
        visible: false,
    };

    constructor(props) {
        super(props);
        this._contentHeight = 0;
        this._duration = 250;
        this._mounted = false;
        //当前状态是否是显示状态
        this._shown = false;
        this.state = {
            visible: props.visible,
            translateY: new Animated.Value(0),
            opacity: 0,
            backgroundColor: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible && nextProps.visible !== this.props.visible) {
            Animated.parallel(
                [
                    Animated.timing(
                        this.state.translateY,
                        {
                            toValue: this._contentHeight,
                            duration: this._duration
                        }
                    ),
                    Animated.timing(
                        this.state.backgroundColor,
                        {
                            toValue: 0,
                            duration: this._duration
                        }
                    )
                ]
            ).start(() => {
                this._shown = false;
                if (this._mounted) {
                    this.setState({
                        visible: false
                    }, () => {
                        nextProps.onHidden && nextProps.onHidden();
                    })
                }
            });
        }
        else if(nextProps.visible && nextProps.visible !== this.props.visible) {
            this.setState({
                visible: true
            })
        }
    }

    render() {
        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']
        })
        return (
            <Modal visible={this.state.visible}
                   onRequestClose={this.props.onRequestClose}
                   transparent={true}>
                <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                    <Animated.View style={[styles.container, {backgroundColor}]}>
                        <Animated.View onStartShouldSetResponder={() => true}
                                       style={{
                                           transform: [{translateY: this.state.translateY}],
                                           opacity: this.state.opacity
                                       }}
                                       onLayout={({nativeEvent: {layout}}) => {
                                           this._contentHeight = layout.height;
                                           if (!this._shown) {
                                               this.setState({
                                                   translateY: new Animated.Value(layout.height),
                                                   opacity: 1
                                               }, () => {
                                                   Animated.parallel(
                                                       [
                                                           Animated.timing(
                                                               this.state.translateY,
                                                               {
                                                                   toValue: 0,
                                                                   duration: this._duration
                                                               }
                                                           ),
                                                           Animated.timing(
                                                               this.state.backgroundColor,
                                                               {
                                                                   toValue: 1,
                                                                   duration: this._duration
                                                               }
                                                           )
                                                       ]
                                                   ).start(() => {
                                                       this._shown = true;
                                                       this.props.onShown && this.props.onShown();
                                                   });
                                               })
                                           }
                                       }}>
                            {this.props.children}
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
    }
})
