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
    Alert,
    Linking
} from 'react-native';
import Config from '../config/config';
import MainStyle from '../styles/MainStyle';

class TopicComponent extends Component {

    constructor(props) {
        super(props);
        this.scaleValue = new Animated.Value(0);
        this.showValue = new Animated.Value(0);
    }

    componentDidMount() {
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
                easing: Easing.easeOut
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

    onPressTopic() {
        const { onPress } = this.props;
        this.scaleBtn(() => {
            onPress();
        });
    }

    // notAllowed(){
    //     Alert.alert(
    //         'Демо версия',
    //         'Данный раздел доступен только в платной версии',
    //         [
    //             {text: 'Отмена', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //             {text: 'Купить', onPress: () => this.props.navigation.navigate('PaymentScreen')},
    //         ],
    //         { cancelable: true }
    //         );
    // }

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
            outputRange: ['-75deg', '1deg']
        });
        const { item } = this.props;
        return (
            <TouchableOpacity
                style={{ opacity: (item.access) ? 1 : .5 }}
                activeOpacity={1}
                //onPress={() => (item.access) ? this.onPressTopic() : this.notAllowed()}>
                onPress={() => this.onPressTopic()}>
                <Animated.View
                    style={[
                        styles.topicStyle,
                        { backgroundColor: item.color || '#f1f1f1' },
                        {
                            opacity: this.showValue,
                            transform: [
                                //{perspective: 600 },
                                { scale: buttonScale },
                                { translateX: showTaskX }
                            ]
                        }
                    ]}>
                    <View style={styles.textBlock}>
                        <Text style={styles.textKaz}>{item.themeKaz}</Text>
                        <Text style={styles.textRus}>{item.themeRus}</Text>
                    </View>
                    <Image source={item.local_url} style={styles.imageTopic} />
                </Animated.View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    topicStyle: {
        marginHorizontal: 25,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 125,
        height: 100,
        overflow: 'hidden',
    },
    textKaz: {
        fontFamily: MainStyle.font,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 3,
    },
    textRus: {
        fontFamily: MainStyle.font,
        fontSize: 13,
        color: 'rgba(255,255,255,.6)',
    },
    imageTopic: {
        width: 90,
        height: 90,
        right: 30,
        bottom: -5,
        position: 'absolute',
        resizeMode: 'contain',
    }

});

module.exports = TopicComponent;
