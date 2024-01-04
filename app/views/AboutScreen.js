'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  FlatList,
  Button,
  Linking,
} from 'react-native';

import MainStyle from '../styles/MainStyle';
import AboutButton from '../components/AboutButton';

class AboutScreen extends Component {
  url = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  render() {
    return (
      <View style={styles.main}>
        <View style={{height: 40}} />
        <Text style={styles.title}>Автор методики: {'\n'}</Text>
        <Text style={{textAlign: 'center'}}>Ш.Д. Кинжикова</Text>
        <View style={{height: 40}} />
        <Text style={styles.title}>По вопросам сотрудничества:</Text>
        <AboutButton
          value="anatilicenter@mail.ru"
          onPress={() => this.url('mailto:anatilicenter@mail.ru')}
        />
        <AboutButton
          value="kinjikova@mail.ru"
          onPress={() => this.url('mailto:kinjikova@mail.ru')}
        />
        <AboutButton
          value="+7 (747) 777-16-19"
          onPress={() => this.url('tel:+77477771619')}
        />
        <View style={{height: 40}} />
        <Text style={styles.title}>Разработчик приложения:</Text>
        <AboutButton
          value="lime.technology"
          onPress={() => this.url('https://lime.technology')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: MainStyle.BGColor,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontFamily: MainStyle.font,
    color: MainStyle.FontColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    fontFamily: MainStyle.font,
    color: MainStyle.AppColorBlue,
    fontSize: 16,
  },
});

export default AboutScreen;
