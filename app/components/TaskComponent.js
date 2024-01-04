'use strict';

import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TouchableHighlight,
    Image,
    View,
    Easing,
    Linking
} from 'react-native'
import MainStyle from '../styles/MainStyle';
import Badge from '../components/Badge';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';

class TaskComponent extends Component {

    constructor(props){
        super(props);
        this.scaleValue = new Animated.Value(0);
        this.showValue = new Animated.Value(0);
    }

    componentDidMount(){
        const { index } = this.props;
        this.showValue.setValue(0);
        Animated.spring(
            this.showValue,
            {
                useNativeDriver: true,
                toValue: 1,
                tension: 50,
                friction: 5,
                //duration: 500,
                delay: index * 200,
                //easing: Easing.easeOut
            }
        ).start();
    }

    scaleBtn(callback) {
        this.scaleValue.setValue(0);
        Animated.timing(
            this.scaleValue,
            {
                useNativeDriver: true,
                toValue: 1,
                duration: 350,
                easing: Easing.easeOut,
            }
        ).start(() => callback());
    }

    onPressTask(){
        const { onPress } = this.props;
        this.scaleBtn(() => {
            onPress();
        });
    }

    render() {
        const buttonScale = this.scaleValue.interpolate({
            inputRange: [0, .33, .66, 1],
            outputRange: [1, .95, 1.04, 1]
        });
        const showTaskX = this.showValue.interpolate({
            inputRange: [0, 1],
            outputRange: [60, 0]
        });
        const showTaskRotateY = this.showValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['-75deg', '0deg']
        });
        const { item, badge } = this.props;
        return(
            <Animated.View
                style={[
                    styles.animView,
                    {
                        opacity: this.showValue,
                        transform: [
                            {translateX: showTaskX},
                            //{perspective: 800},
                            {scale: buttonScale},
                            //{rotateX: showTaskRotateY}
                        ]
                    }
                ]}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.onPressTask()}>
                    <LinearGradient
                        colors={item.gradient}
                        style={styles.taskStyle}
                        start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}>
                        <View style={styles.textBlock}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.desc}>{item.desc}</Text>
                        </View>
                        <Image source={item.image} style={styles.imageTask}/>
                    </LinearGradient>
            </TouchableOpacity>
            { badge ? <Badge 
                style={styles.badge} 
                styleText={styles.badgeText} 
                count={badge}
            /> : null}
            </Animated.View>
        )
    }
}


const styles = StyleSheet.create({
    animView:{
        opacity: 0,
        paddingHorizontal: 25,
    },
    badgeText: {
        fontSize: 14,
        lineHeight: 24,
    },
    badge:{
        borderRadius: 13,
        width: 26,
        height: 26,
        position: 'absolute',
        right: 13,
        top: -13,
    },
    taskStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
        paddingLeft: 25,
        paddingRight: 120,
        borderRadius: 5,
        overflow: 'hidden',
        //backgroundColor: 'red',
    },
    title:{
        fontFamily: MainStyle.font,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    desc:{
        fontFamily: MainStyle.font,
        fontSize: 12,
        color: 'rgba(255,255,255,.6)',

    },
    imageTask:{
        width: 100,
        height: 100,
        right: 25,
        bottom: -10,
        position: 'absolute',
        resizeMode: 'contain',
    }

});

module.exports = TaskComponent;
