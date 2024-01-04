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
import AppButton from '../components/AppButton';

class TaskOnlineScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Онлайн-занятия',
  });

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
    const {user} = this.props.screenProps;
    return (
      <View style={styles.main}>
        <View style={{height: 40}} />
        <Text style={styles.title}>Для работы на компьютере: {'\n'}</Text>
        <Text style={{textAlign: 'center'}}>
          Введите следующую ссылку в браузере: {'\n'}
        </Text>

        <AboutButton
          value="ana-tili.kz/k"
          onPress={() => this.url('http://ana-tili.kz/k')}
        />
        <Text selectable style={{textAlign: 'center'}}>
          Ваш e-mail:{' '}
          <Text selectable style={{fontWeight: 'bold'}}>
            {user.email}
          </Text>
        </Text>
        <Text selectable style={{textAlign: 'center'}}>
          Ваш пароль:{' '}
          <Text selectable style={{fontWeight: 'bold'}}>
            {user.token.substr(0, 6).toLowerCase()}
          </Text>{' '}
        </Text>

        <View style={{height: 40}} />
        <Text style={styles.title}>Для работы со смартфона: {'\n'}</Text>
        <AppButton
          style={{backgroundColor: '#66BB6A', alignSelf: 'center'}}
          underlayColor="#4CAF50"
          fontColor="white"
          value="Перейти"
          onPress={() =>
            this.url('http://api.ana-tili.kz/account/?token=' + user.token)
          }
        />
      </View>
    );
  }

  componentWillUnmount() {
    this.props.screenProps._getCountNewTasks();
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
  headerBtn: {
    paddingHorizontal: 15,
  },
});

export default TaskOnlineScreen;
