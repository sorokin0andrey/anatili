'use strict';

import React, {Component} from 'react';
import {Alert, View} from 'react-native';
import Config from './config/config';
import Api from './config/api';
import {Root} from './config/router';
import {updateFocus, getCurrentRouteKey} from 'react-navigation-is-focused-hoc';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import Preloader from './components/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';
//import type { RemoteMessage } from 'react-native-firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      push_token: '',
      lang_latin: 0,
      countNewMessages: 0,
      dataReceivePush: {},

      countNewTasks: 0,

      preloader: false,
    };
  }

  componentDidMount() {
    //AsyncStorage.clear();

    this._getStoreData('lang_latin', value => {
      if (value !== null) {
        this.setState({
          lang_latin: value,
        });
      }
    });

    this._getStoreData('user', value => {
      if (value !== null) {
        this.setState({
          user: value,
        });
      }
    });

    this._checkPermission();
    this._createNotificationListeners();
    this._getUnreadMessages();
  }

  async _checkPermission() {
    const enabled = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('push permission: ' + enabled);
    if (enabled) {
      this._getToken();
    } else {
      this._requestPermission();
    }
  }

  //3
  async _getToken() {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log('user token: ' + fcmToken);
          this.setState({
            push_token: fcmToken,
          });
          this._saveStoreData('pushToken', fcmToken);
        } else {
          // user doesn't have a device token yet
        }
      });
  }

  //2
  async _requestPermission() {
    try {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (res !== 'granted') {
        throw new Error('permission rejected');
      }
      // User has authorised
      this._getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async _checkPushData(data) {
    console.log('data: ', data);
    if (data) {
      this.setState({
        dataReceivePush: data,
      });
    }
  }

  async _getUnreadMessages() {
    this._getStoreData('user', value => {
      if (value !== null) {
        //console.log('user: ', value)
        database()
          .ref()
          .child('messages/0-' + value.id_user)
          .orderByChild('view')
          .equalTo(value.id_user + '-0')
          .on('value', snapshot => {
            console.log('num_calls: ', snapshot.numChildren());
            this.setState({
              countNewMessages: snapshot.numChildren(),
            });
          });
      }
    });
  }

  async _createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = messaging().onMessage(message => {
      const {title, body, data} = message;
      console.log(message);
      this.showAlert(
        message.notification.title,
        message.notification.body,
        data,
        'onNotification',
      );
    });
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      notificationOpen => {
        const {title, body, data} = notificationOpen.notification;
        console.log(notificationOpen.notification);
        this.showAlert(title, body, data, 'onNotificationOpened');
      },
    );
    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen) {
      console.log(notificationOpen.notification);
      const {title, body, data} = notificationOpen.notification;
      this.showAlert(title, body, data, 'getInitialNotification');
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body, data, text) {
    this._checkPushData(data);
    // Alert.alert(
    //   title, body + ' / ' + text,
    //   [
    //       { text: 'OK', onPress: () => this._checkPushData(data) },
    //   ],
    //   { cancelable: false },
    // );
  }

  async _getStoreData(name, afterGet) {
    try {
      let value = await AsyncStorage.getItem(name);
      value = JSON.parse(value);
      afterGet(value);
    } catch (error) {
      console.log('Error getting data' + error);
    }
  }
  async _saveStoreData(name, value) {
    //if(typeof value === 'object') value = JSON.stringify(value);
    value = JSON.stringify(value);
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.log('Error setting data' + error);
    }
  }

  async _removeStoreData(name) {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.log('Error removing data' + error);
    }
  }

  _getCountNewTasks = async () => {
    const {user} = this.state;
    if (user) {
      let formData = new FormData();
      formData.append('user_id', user.id_user);
      formData.append('user_token', user.token);
      //console.log(formData);
      Api.fetchData(
        Config.DOMAIN + '?action=getWebTasksCount',
        formData,
        null,
      ).then(result => {
        //console.log(result);
        if (result.count) {
          this.setState({
            countNewTasks: result.count,
          });
        }
      });
    }
  };

  _getUserInfo = async () => {
    const {user} = this.state;
    if (user) {
      let formData = new FormData();
      formData.append('user_id', user.id_user);
      formData.append('user_token', user.token);
      Api.fetchData(Config.DOMAIN + '?action=getUserInfo', formData, null).then(
        result => {
          if (result === 'No connection') {
          } else {
            if (result.error) {
            } else {
              let userData = {
                id_user: user.id_user,
                token: user.token,
                email: result.email,
                is_payment: result.is_payment,
              };
              this._signIn(userData);
            }
          }
        },
      );
    }
  };

  _signIn(user) {
    console.log('auth: ', user);
    this._saveStoreData('user', user);
    this.setState({
      user: user,
    });
    this._getUnreadMessages();
  }

  _signOut() {
    this._removeStoreData('user');
    this.setState({
      user: null,
    });
  }

  _changeLat() {
    if (this.state.lang_latin) {
      this._saveStoreData('lang_latin', 0);
      this.setState({
        lang_latin: 0,
      });
    } else {
      this._saveStoreData('lang_latin', 1);
      this.setState({
        lang_latin: 1,
      });
    }
  }

  _preloader(value) {
    this.setState({
      preloader: value,
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Root
          uriPrefix={'anatili://'}
          screenProps={{
            ...this.state,
            _getUserInfo: () => this._getUserInfo(),
            _getCountNewTasks: () => this._getCountNewTasks(),
            _signIn: user => this._signIn(user),
            _signOut: () => this._signOut(),
            _changeLat: () => this._changeLat(),
            _preloader: bool => this._preloader(bool),
          }}
          onNavigationStateChange={(prevState, currentState) => {
            updateFocus(currentState);
          }}
        />

        {this.state.preloader ? <Preloader full /> : null}
      </View>
    );
  }

  componentWillUnmount() {
    this.messageListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }
}

export default App;
