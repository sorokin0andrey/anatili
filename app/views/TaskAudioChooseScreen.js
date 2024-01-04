'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Image,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  PixelRatio,
  BackHandler,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../components/AppButton';
import Icon from 'react-native-vector-icons/Ionicons';

const data = [
  {
    id: 1,
    title: 'Аудиоистория 1',
    success: 1,
  },
  {
    id: 2,
    title: 'Аудиоистория 2',
    success: 0,
  },
  {
    id: 3,
    title: 'Аудиоистория 3',
    success: 0,
  },
];

class TaskAudioChooseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      histories: data,
      refreshing: false,
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getHistories(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getHistories(user) {
    const {navigate, goBack} = this.props.navigation;
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getAudioList',
      formData,
      this.props.screenProps,
    ).then(result => {
      console.log(result);
      if (result === 'No connection') {
        this.setState({
          noConnection: true,
          refreshing: false,
          progress: false,
        });
      } else {
        if (result.error) {
          Alert.alert('Ошибка!', result.error[0], [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
              style: 'cancel',
            },
          ]);
          goBack(null);
        } else {
          this.setState({
            histories: result,
          });
        }
        this.setState({
          noConnection: false,
          refreshing: false,
          progress: false,
        });
      }
    });
  }

  onPressHistory(item) {
    const {navigate, state} = this.props.navigation;
    navigate('TaskAudioScreen', {
      gradient: state.params.gradient,
      task_id: item.id,
      title: item.title,
      user: this.state.user,
    });
  }

  // notAllowed(){
  //     Alert.alert(
  //         'Демо версия',
  //         'Данная аудиозапись доступна только в платной версии',
  //         [
  //             {text: 'Отмена', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //             {text: 'Купить', onPress: () => this.props.navigation.navigate('PaymentScreen')},
  //         ],
  //         { cancelable: true }
  //         );
  // }

  itemHistory(item, index) {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        activeOpacity={1}
        //onPress={() => (item.access) ? this.onPressHistory(item) : this.notAllowed()}>
        onPress={() => this.onPressHistory(item)}>
        <View style={[styles.titleBox, {opacity: item.access ? 1 : 0.5}]}>
          <Text
            style={[
              styles.title,
              item.isCompleted ? null : {fontWeight: 'bold'},
            ]}
            numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subTitle} numberOfLines={1}>
            Автор: {item.author}
          </Text>
        </View>
        {item.isCompleted ? (
          <View style={styles.iconBox}>
            <Icon name="checkmark-circle-outline" style={styles.iconSuccess} />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {histories, progress} = this.state;
    return (
      <LinearGradient
        colors={state.params.gradient}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        <StatusBar
          backgroundColor={state.params.gradient[0]}
          barStyle="light-content"
          animated={true}
        />
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{height: MainStyle.headerHeight + MainStyle.statusBarHeight}}
          />
          <View style={styles.container}>
            {progress ? (
              <Preloader color="white" />
            ) : (
              <FlatList
                style={styles.listHis}
                ItemSeparatorComponent={highlighted => (
                  <View
                    style={[styles.separator, highlighted && {marginLeft: 0}]}
                  />
                )}
                keyExtractor={(item, index) => 'history_' + index}
                data={histories}
                renderItem={({item, index}) => this.itemHistory(item, index)}
                ListFooterComponent={() => <View style={{height: 50}} />}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  itemStyle: {
    paddingHorizontal: 30,
    //paddingVertical: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBox: {
    flexShrink: 1,
  },
  title: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: 'white',
  },
  subTitle: {
    fontFamily: MainStyle.font,
    fontSize: 12,
    color: 'rgba(255,255,255,.5)',
  },
  iconSuccess: {
    fontSize: 28,
    color: 'white',
  },
  separator: {
    height: 1 / PixelRatio.get(),
    backgroundColor: 'rgba(255,255,255,.8)',
  },
});

export default TaskAudioChooseScreen;
