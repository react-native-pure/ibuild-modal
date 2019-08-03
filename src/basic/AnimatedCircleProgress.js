/**
 * @overview 文件描述
 * @author heykk
 */



import React, {Component} from 'react';
import {
    Animated
} from 'react-native';
import CircleProgressView from './CircleProgressView';

const AnimatedCP = Animated.createAnimatedComponent(CircleProgressView);

type AnimatedCircleProgressProps = {
    progress: number,
    totalNum:number,
    progressWidth:number,
    raduis: number,
    durtime: number,
    progressColor: string,
    progressBaseColor: string,
    centerViewMode: string,
}

export default class AnimatedCircleProgress extends Component<AnimatedCircleProgressProps> {

    static defaultProps = {
        durtime: 1000,
        progress: 0,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress1: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.progress != this.props.progress
            || this.props.totalNum != nextProps.totalNum) {
            this.startAnimate(nextProps.progress);
        }
    }

    componentDidMount() {
        this.startAnimate(this.props.progress)
    }

    startAnimate(progress) {
        this.state.progress1.setValue(progress);
    }

    render() {

        const {durtime, progress, ...other} = this.props;

        return (
            <AnimatedCP
                {...other}
                progress={this.state.progress1}
            />
        );
    }

}