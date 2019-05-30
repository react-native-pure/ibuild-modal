/**
 * @overview 文件描述
 * @author jean.h.ma
 */
import * as React from "react"
import {View, StyleSheet, ImageBackground, TouchableWithoutFeedback} from "react-native"
import hoistNonReactStatics from 'hoist-non-react-statics';
import Icon from "react-native-vector-icons/MaterialIcons"
import merge from "deepmerge"

/**
 * 视频播放状态
 * @type {{stop: string, play: string, pause: string}}
 */
export const VideoPlayStatus = {
    stop: 'stop',
    play: 'play',
    paused: 'paused'
}


const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
});

type VideoSimpleControlOption = {
    icon: {
        color: string,
        size: number
    },
    delay: number
};

const defaultVideoSimpleControlOption: VideoSimpleControlOption = {
    icon: {
        color: "white",
        size: 60
    },
    delay: 5000
};

export default function (option: VideoSimpleControlOption = {}) {
    const nextOption = merge(defaultVideoSimpleControlOption, option);
    return function (VideoPlayer) {
        class VideoPlayerWithControl extends React.Component {
            _videoRef = null;
            _timer = null;

            constructor(props) {
                super(props);
                this._mount = false;

                this.toggleControl = () => {
                    this.state.status !== VideoPlayStatus.stop && this.setState(({showControl}) => {
                        return {
                            showControl: !showControl
                        }
                    })
                }
                this._onReadyContainerLayout = ({nativeEvent: {layout: {width, height}}}) => {
                    this.setState({
                        readyWidth: width,
                        readyHeight: height
                    });
                }
                this.stop = () => {
                    if (this._mount) {
                        this.setState({
                            status: VideoPlayStatus.stop,
                            showControl: true
                        })
                    }
                }

                this.state = {
                    readyWidth: 0,
                    readyHeight: 0,
                    status: !props.paused ? VideoPlayStatus.play : VideoPlayStatus.stop,
                    showControl: true,
                };
            }


            componentDidMount() {
                this._mount = true;
                this.props.controlRef && this.props.controlRef(this);
            }

            get paused() {
                if (this.state.status === VideoPlayStatus.play) {
                    return false
                }
                return true
            }


            _renderPlayButton() {
                if (this.state.showControl) {
                    if (this.paused) {
                        return (
                            <View style={[StyleSheet.absoluteFill, styles.buttonContainer]}>
                                <TouchableWithoutFeedback onPress={() => {
                                    this.setState({status: VideoPlayStatus.play})
                                }}>
                                    <Icon name="play-circle-outline" {...nextOption.icon}></Icon>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    }
                    else {
                        return (
                            <View style={[StyleSheet.absoluteFill, styles.buttonContainer]}>
                                <TouchableWithoutFeedback onPress={() => {
                                    this.setState({status: VideoPlayStatus.pause})
                                }}>
                                    <Icon name="pause-circle-outline" {...nextOption.icon}></Icon>
                                </TouchableWithoutFeedback>
                            </View>
                        );
                    }
                }
                return null;
            }

            renderReady() {
                const hasPoster = this.props.poster && this.props.poster.length > 0;
                const props = {
                    source: require("../../assets/bg_movie.png")
                }
                if (hasPoster) {
                    props.source = {uri: this.props.poster}
                    props.resizeMode = "contain"
                }
                return (
                    <View style={[styles.poster, this.props.style]}
                          onLayout={this._onReadyContainerLayout}>
                        <ImageBackground style={[styles.posterImage, {
                            width: this.state.readyWidth,
                            height: this.state.readyHeight,
                        }]} {...props}>
                            {this._renderPlayButton()}
                        </ImageBackground>
                    </View>
                );
            }

            render() {
                if (this.state.status === VideoPlayStatus.stop) {
                    return this.renderReady()
                }
                const {style, forwardedRef, onEnd, ...rest} = this.props;
                return (
                    <View style={[{backgroundColor: '#000'}, style]}>
                        <VideoPlayer {...rest}
                                     style={style}
                                     poster={null}
                                     paused={this.paused}
                                     ref={ref => {
                                         this._videoRef = ref;
                                         forwardedRef && forwardedRef(ref)
                                     }}
                                     onEnd={(...args) => {
                                         if (!this.props.repeat) {
                                             this.setState({
                                                 status: VideoPlayStatus.stop,
                                                 showControl: true
                                             }, () => {
                                                 if (this._videoRef) {
                                                     this._videoRef.seek(0);
                                                 }
                                                 onEnd && onEnd(...args);
                                             });
                                         }
                                         else {
                                             onEnd && onEnd(...args);
                                         }
                                     }}/>
                        {this._renderPlayButton()}
                    </View>
                );
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                if (this.state.showControl) {
                    if (this.state.status !== VideoPlayStatus.stop) {
                        if (this._timer) {
                            clearTimeout(this._timer);
                        }
                        this._timer = setTimeout(() => {
                            this.state.status !== VideoPlayStatus.stop && this.setState({showControl: false})
                        }, nextOption.delay);
                    }
                    else {
                        if (this._timer) {
                            clearTimeout(this._timer);
                        }
                    }
                }
            }

            componentWillUnmount() {
                this._mount = false;
                if (this._timer) {
                    clearTimeout(this._timer);
                }
            }
        }

        hoistNonReactStatics(VideoPlayerWithControl, VideoPlayer);

        const nextVideoPlayer = React.forwardRef((props, ref) => {
            return <VideoPlayerWithControl {...props} forwardedRef={ref}/>
        });

        hoistNonReactStatics(nextVideoPlayer, VideoPlayerWithControl);

        return nextVideoPlayer;
    }
}
