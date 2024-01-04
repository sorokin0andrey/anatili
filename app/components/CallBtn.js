'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import MainStyle from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';


class CallBtn extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const { style, styleIcon, phone } = this.props;
        return (
            <TouchableOpacity style={[styles.callBtn, style]} activeOpacity={.9} onPress={() => Communications.phonecall(phone, true)}>
                <Icon name="phone" style={[styles.callBtnIcon, styleIcon]} />
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    callBtn:{
        backgroundColor: MainStyle.MainColor,
        borderRadius: 27,
        height: 54,
        width: 54,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.2,
    },
    callBtnIcon:{
        color: 'white',
        fontSize: 27,
        textAlign: "center",
        backgroundColor: "transparent"
    },

});

module.exports = CallBtn;