'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  //WebView,
  Alert,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

// const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//         NavigationActions.navigate({ routeName: 'MainTabs'})
//     ]
// });
const LeftBtnBack = func => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={MainStyle.headerBtn}
    onPress={() => func()}>
    <Icon
      name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'arrow-back'}
      size={34}
      color={MainStyle.HeaderTintColor}
    />
  </TouchableOpacity>
);

class PaymentScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: LeftBtnBack(() => navigation.state.params.payEnd()),
  });

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      url: null,
      progress: true,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      payEnd: () => this.payEnd(),
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.payEnd();
      return true;
    });

    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.setState({
          user: u,
        });
        this._getPaymentUrl(u.id_user, u.token);
      }
    });
  }

  _getPaymentUrl = (id, token) => {
    let formData = new FormData();
    formData.append('user_id', id);
    formData.append('user_token', token);
    console.log(formData);
    Api.fetchData(
      Config.DOMAIN + '?action=getPaymentUrl',
      formData,
      this.props.screenProps,
    ).then(result => {
      console.log(result);
      if (result.success) {
        this.setState({
          url: result.result.url,
        });
      }
      if (result.error) {
        Alert.alert('Ошибка!', result.error[0], [
          {
            text: 'OK',
            onPress: () => this.props.navigation.goBack(null),
            style: 'cancel',
          },
        ]);
      }
      this.setState({
        progress: false,
      });
    });
  };

  payEnd() {
    this.props.screenProps._preloader(true);
    const {navigate, goBack, dispatch} = this.props.navigation;
    const {user} = this.state;
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    Api.fetchData(
      Config.DOMAIN + '?action=getUserInfo',
      formData,
      this.props.screenProps,
    ).then(result => {
      console.log(result);

      if (!result.error) {
        if (result.is_payment) {
          let u = {
            id_user: user.id_user,
            token: user.token,
            email: result.email,
            is_payment: result.is_payment,
          };
          this.props.screenProps._signIn(u);
          goBack(null);
          goBack(null);
        } else {
          goBack(null);
        }
      } else {
        goBack(null);
      }
      this.props.screenProps._preloader(false);
    });
  }

  render() {
    const {progress, url} = this.state;
    return progress ? (
      <Preloader />
    ) : (
      <View style={styles.main}>
        {/* <WebView
                    source={{uri: url}}
                    style={styles.webPage}/> */}
      </View>
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: MainStyle.BGColor,
    flex: 1,
  },
  webPage: {
    width: MainStyle._width,
  },
  headerBtn: {
    paddingHorizontal: 15,
  },
});

export default PaymentScreen;
