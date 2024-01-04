'use strict';

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    PixelRatio
} from 'react-native'
import MainStyle from '../styles/MainStyle';


class RadioButton extends Component {

    constructor(props){
        super(props);
    }
    render() {
        const { active } = this.props;
        return (
            <View style={[styles.circleRound, active ? {borderColor: MainStyle.MainColor} : null]}>
                { active ? <View style={styles.circleFill}/> : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    circleRound:{
        backgroundColor: "transparent",
        borderRadius: 10,
        height: 20,
        width: 20,
        borderWidth: 4 / PixelRatio.get(),
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleFill:{
        backgroundColor: MainStyle.MainColor,
        borderRadius: 5,
        height: 10,
        width: 10,
    },
});
module.exports = RadioButton;