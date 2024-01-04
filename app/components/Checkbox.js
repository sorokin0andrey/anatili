'use strict';

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    PixelRatio
} from 'react-native'
import MainStyle from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/Octicons';

class Checkbox extends Component {

    constructor(props){
        super(props);
    }
    render() {
        const { active } = this.props;
        return (
            <View style={[styles.circleRound, active ? {borderColor: MainStyle.MainColor} : null]}>
                { active ? <Icon name="check" style={styles.iconCheck}/> : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    circleRound:{
        backgroundColor: "transparent",
        borderRadius: 5,
        height: 20,
        width: 20,
        borderWidth: 4 / PixelRatio.get(),
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCheck:{
        left: 2,
        fontSize: 17,
        color: MainStyle.MainColor,
        textAlign: 'center'
    },
});
module.exports = Checkbox;