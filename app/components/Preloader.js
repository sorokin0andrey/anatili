'use strict';

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native'
import MainStyle from '../styles/MainStyle';


class Preloader extends Component {

    constructor(props){
        super(props);
    }
    render() {
        const { color, full } = this.props;
        return (
            <View style={[styles.bgSpinner, full ? styles.full : null]}>
                <ActivityIndicator size="large" color={color || MainStyle.AppColorBlue}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    full:{
        backgroundColor: 'rgba(255,255,255,.75)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    bgSpinner:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

});

module.exports = Preloader;
