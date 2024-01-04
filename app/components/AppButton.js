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
import * as Progress from 'react-native-progress';

class AppButton extends Component {

    constructor(props){
        super(props);
    }
    render() {
        const { style, value, onPress, underlayColor, progress, fontColor } = this.props;
        return  (progress) ? (
            <View style={[styles.btnBlock, style || null]}>
                <Progress.CircleSnail color={fontColor || MainStyle.FontColor} size={30} thickness={2} duration={1000} spinDuration={3000}/>
            </View>
        ) : (
            <TouchableHighlight
                activeOpacity={1}
                underlayColor={ underlayColor ? underlayColor : 'white' }
                style={[styles.btnBlock, style || null]}
                onPress={onPress}>
                <View style={styles.btnBlockWrapper}>
                    <Text style={[styles.btnBlockText, fontColor ? {color: fontColor} : null]}>{value}</Text>
                    {this.props.children}
                </View>
            </TouchableHighlight>
        )
    }
}


const styles = StyleSheet.create({
    btnBlock:{
        backgroundColor: 'white',
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        borderRadius: 4,
        alignSelf: 'stretch'
    },
    btnBlockWrapper:{
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        borderRadius: 4,
        flexDirection: 'row',
    },
    btnBlockText:{
        color: MainStyle.FontColor,
        fontFamily: MainStyle.fontMedium,
        fontSize: 18,
        fontWeight: (Platform.OS === 'ios') ? 'bold' : 'normal',
        textAlign: 'center',
    },

});

module.exports = AppButton;