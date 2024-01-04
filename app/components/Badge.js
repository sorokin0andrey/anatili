'use strict';

import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import MainStyle from '../styles/MainStyle';


class Badge extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const prop = this.props;
        //console.log(prop.count)
        return (prop.count === 0) ? null :(
            <View style={[ (prop.count > 99) ? styles.badge99 : styles.badge, prop.style]}>
                <Text style={[styles.badgeCount, prop.styleText]}>{prop.count}</Text>
            </View> 
        )
    }
}


const styles = StyleSheet.create({
    badge99:{
        backgroundColor: 'red',
        borderRadius: 10,
        height: 20,
        paddingHorizontal: 5,
    },
    badge:{
        backgroundColor: 'red',
        borderRadius: 10,
        height: 20,
        width: 20,
    },
    badgeCount:{
        fontFamily: MainStyle.font,
        color: 'white',
        fontSize: 12,
        textAlign: "center",
        lineHeight: 20,
        backgroundColor: "transparent"
    },

});

module.exports = Badge;
