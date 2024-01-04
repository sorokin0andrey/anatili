'use strict';

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import MainStyle from '../styles/MainStyle';


class Sticker extends Component {

    constructor(props){
        super(props);
    }
    render() {
        const prop = this.props;
        return (
            <View style={[styles.countView, {backgroundColor: prop.bgcolor || MainStyle.MainColor}, prop.style]}>
                <Text style={[styles.count, {color: prop.colorText || 'white'}]}>{prop.count}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    countView:{
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        position:'absolute',
    },
    count:{
        textAlign:'center',
        fontSize: 14,
        fontFamily: MainStyle.font,
    },
});

module.exports = Sticker;