'use strict';

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';

class EmptyScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
      const {route, index, focused} = scene;
      if (!focused) {
        //console.log(previousScene, scene);
        //jumpToIndex(index);
        AsyncStorage.getItem('user').then(user => {
          if (user === null) {
            navigation.navigate('AuthScreen', {});
          } else {
            user = JSON.parse(user);
            navigation.navigate('ChatScreen', {id_user: user.id_user});
          }
        });
      }
    },
  });

  render() {
    return <View style={styles.main} />;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: MainStyle.BGColor,
    flex: 1,
  },
});

export default EmptyScreen;
