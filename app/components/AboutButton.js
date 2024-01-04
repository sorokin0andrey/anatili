'use strict';

import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    TouchableHighlight,
    View,
    Platform
} from 'react-native'
import MainStyle from '../styles/MainStyle';

const AboutButton = ({...props}) => {
    const { value, onPress } = props;
    return (
        <TouchableHighlight
            activeOpacity={1}
            underlayColor='transparent'
            style={styles.btnStyle}
            onPress={onPress}>
                <Text style={styles.btnStyleText}>{value}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    btnStyle:{
        backgroundColor: 'transparent',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    btnStyleText:{
        color: MainStyle.AppColorBlue,
        fontFamily: MainStyle.font,
        fontSize: 16,
        textAlign: 'center',
    },

});

module.exports = AboutButton;
