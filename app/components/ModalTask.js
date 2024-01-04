'use strict';

import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    Modal,
    View,
    Platform
} from 'react-native'
import MainStyle from '../styles/MainStyle';

class ModalTask extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const { modalVisible } = this.props;
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.modalBox}>
                    {this.props.children}
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    modalBox:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.9)',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBoxContent:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorIconResult:{
        color: 'red',
        fontSize: 80,
    },
    textResult:{
        fontFamily: MainStyle.font,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    textResultSub:{
        fontFamily: MainStyle.font,
        fontSize: 14,
        color: 'rgba(255,255,255,.6)',
        textAlign: 'center',
    },
    btnResultContinue: {
        //margin: 30,
    },
    cash:{
        fontSize: 52,
        fontFamily: MainStyle.font,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }

});

module.exports = ModalTask;