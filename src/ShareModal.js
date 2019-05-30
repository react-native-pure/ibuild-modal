import React, {Component} from "react"
import {View, Text, StyleSheet, Image, TouchableWithoutFeedback} from "react-native"
import {shareToWeChatSceneTimeline, shareToWeChatSceneSession} from "@ibuild-community/react-native-share";
import {ShareData} from '@ibuild-community/react-native-share/index'
import PopModal from "./PopModal"


type ShareModalProps = ModalProps & {
    data: ShareData,
}

export default class ShareModal extends Component <ShareModalProps>{
    static defaultProps = {
        visible: false
    };

    render() {
        return (
            <PopModal onRequestClose={this.props.onRequestClose}
                      onShown={this.props.onShown}
                      onHidden={this.props.onHidden}
                      visible={this.props.visible}>
                <Text style={styles.title}>分享到</Text>
                <View style={styles.content}>
                    <TouchableWithoutFeedback onPress={() => {
                        shareToWeChatSceneSession(this.props.data)
                    }}>
                        <View style={styles.itemView}>
                            <Image source={require("../assets/webchat.png")}/>
                            <Text style={styles.itemText}>微信</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        shareToWeChatSceneTimeline(this.props.data);
                    }}>
                        <View style={styles.itemView}>
                            <Image source={require("../assets/webchat-timeline.png")}/>
                            <Text style={styles.itemText}>朋友圈</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.splitView}></View>
                <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                    <View style={styles.buttonView}>
                        <Text style={styles.buttonText}>取消</Text>
                    </View>
                </TouchableWithoutFeedback>
            </PopModal>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        backgroundColor: "white",
        // justifyContent: "space-around",
        paddingVertical: 19,
        justifyContent: "center"
    },
    itemView: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 30
    },
    itemText: {
        marginTop: 4
    },
    buttonView: {
        height: 49,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    buttonText: {
        fontSize: 16,
        color: "#333333"
    },
    splitView: {
        backgroundColor: "#F5F7F9",
        height: 10
    },
    title: {
        color: "#888888",
        fontSize: 16,
        backgroundColor: "white",
        textAlign: "center",
        paddingTop: 11
    }
})
