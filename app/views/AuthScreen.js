'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../config/api';
import Config from '../config/config';
import MainStyle from '../styles/MainStyle';
import {NavigationActions} from 'react-navigation';
//import SplashScreen from 'react-native-splash-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../components/AppButton';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';

const imageBG = MainStyle.imageBG;

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'MainTabs'})],
});

class AuthScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      showPass: false,
      auth_key: '',
      timerSendMail: 30,
      sendMailActive: false,

      progress: true,
      progressSend: false,
      progressSendAuth: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    AsyncStorage.getItem('user').then(user => {
      if (user != null) {
      }
    });
  }
  componentWillUnmount() {
    if (this.timerSend) {
      clearInterval(this.timerSend);
    }

    this._isMounted = false;
  }

  render() {
    const {dispatch, navigate} = this.props.navigation;
    const {
      email,
      pass,
      progressSend,
      timerSendMail,
      sendMailActive,
      progressSendAuth,
      showPass,
    } = this.state;

    return (
      <LinearGradient
        colors={[MainStyle.AppColorBlue, '#0097A7']}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        <KeyboardAwareScrollView
          keyboardVerticalOffset={200}
          keyboardShouldPersistTaps="always"
          enableOnAndroid={true}
          keyboardOpeningTime={300}
          style={{marginHorizontal: 30}}>
          {/*<Image source={require('../image/books_image.png')} style={styles.books_image}/>*/}
          <View style={{height: 50}} />
          <Text style={styles.title}>
            Чтобы начать обучение, нужно выполнить вход
          </Text>
          <View style={{height: 35}} />
          <Text style={styles.nameInput}>Ваш E-mail</Text>
          <TextInput
            onChangeText={email => this.setState({email})}
            underlineColorAndroid="transparent"
            style={styles.input}
            //placeholder="E-mail"
            keyboardType="email-address"
            //placeholderTextColor="rgba(255,255,255,0.6)"
            value={email}
            maxLength={255}
          />
          <View style={{height: 25}} />

          <AppButton
            progress={progressSend}
            value="Войти"
            onPress={() => this.sendMail()}
          />

          {/* {
                        !showPass ? <AppButton
                            //style={{alignSelf: 'stretch'}}
                            //underlayColor="white"
                            progress={progressSend}
                            value="Получить код на почту"
                            onPress={() => this.sendMail()} /> :
                            <View>
                                <AppButton
                                    style={{ opacity: sendMailActive ? 1 : .6 }}
                                    //underlayColor="white"
                                    progress={progressSend}
                                    value={sendMailActive ? "Выслать код повторно" : "Выслать код повторно (" + timerSendMail + " сек.)"}
                                    onPress={() => sendMailActive ? this.sendMail() : {}} />
                                <View style={{ height: 25 }} />
                                <Text style={styles.nameInput}>Код для входа</Text>
                                <TextInput
                                    onChangeText={(pass) => this.setState({ pass })}
                                    underlineColorAndroid="transparent"
                                    style={styles.input}
                                    //placeholder="Пароль"
                                    //placeholderTextColor="rgba(255,255,255,0.6)"
                                    value={pass}
                                    keyboardType={Platform.OS === 'ios' ? "number-pad" : "phone-pad"}
                                    maxLength={6} />
                                <View style={{ height: 25 }} />
                                <AppButton
                                    // style={{alignSelf: 'stretch'}}
                                    progress={progressSendAuth}
                                    value="Войти"
                                    onPress={() => this.auth()} />
                            </View>
                    } */}
          <View style={{height: 30}} />
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  }

  initTimerSendMail() {
    let {timerSendMail} = this.state;
    if (timerSendMail === 0) {
      clearInterval(this.timerSend);
      this.setState({
        timerSendMail: 30,
        sendMailActive: true,
      });
    } else if (this._isMounted) {
      this.setState({
        timerSendMail: timerSendMail - 1,
      });
    }
  }

  sendMail() {
    this.setState({progressSend: true});

    let formData = new FormData();
    formData.append('email', this.state.email);

    Api.fetchData(
      Config.DOMAIN + '?action=saveUser',
      formData,
      this.props.screenProps,
    ).then(result => {
      //console.log(result);
      if (result === 'No connection') {
        this.setState({
          noConnection: true,
          progressSend: false,
        });
      } else {
        if (!result.error) {
          // Alert.alert(
          //     'Готово!',
          //     result.success[0],
          //     [
          //         {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},
          //     ]
          // );

          // this.setState({
          //     showPass: true,
          //     sendMailActive: false,
          //     timerSendMail: 30,
          // });

          //this.timerSend = setInterval(() => this.initTimerSendMail(), 1000);
          this.auth();
        }
        if (result.error) {
          Alert.alert('Ошибка!', result.error[0], [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
              style: 'cancel',
            },
          ]);
        }
        this.setState({
          noConnection: false,
          progressSend: false,
        });
      }
    });
    Keyboard.dismiss();
  }

  auth() {
    const {navigate, dispatch, state, goBack} = this.props.navigation;
    const {screenProps} = this.props;
    //const { nextScene } = this.props
    this.setState({progressSendAuth: true});

    let formData = new FormData();
    formData.append('email', this.state.email);
    //formData.append('auth_key', this.state.pass);
    formData.append('auth_key', '111');
    formData.append(
      'os',
      Platform.select({
        ios: 1,
        android: 2,
      }),
    );
    formData.append('os_v', Platform.Version);
    console.log(formData);
    Api.fetchData(Config.DOMAIN + '?action=login', formData, screenProps).then(
      result => {
        console.log(result);
        if (result === 'No connection') {
          this.setState({
            noConnection: true,
            progressSendAuth: false,
          });
        } else {
          if (!result.error) {
            let user = {
              id_user: result.user_id,
              token: result.token,
              email: this.state.email,
              is_payment: result.is_payment,
            };
            screenProps._getCountNewTasks();
            screenProps._signIn(user);
            database()
              .ref()
              .child('users/' + result.user_id + '/pushToken')
              .set(screenProps.push_token);
            goBack(null);
          }
          if (result.error) {
            Alert.alert('Ошибка!', result.error[0], [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
                style: 'cancel',
              },
            ]);
          }
          this.setState({
            noConnection: false,
            progressSendAuth: false,
          });
        }
      },
    );

    Keyboard.dismiss();
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    //backgroundColor: MainStyle.AppColorBlue,
  },
  title: {
    fontFamily: MainStyle.fontMedium,
    color: 'rgba(255,255,255,.8)',
    fontSize: 18,
    textAlign: 'center',
    //paddingHorizontal: 30,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  nameInput: {
    color: 'rgba(255,255,255,.6)',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    marginVertical: 5,
  },
  input: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'white',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    height: 48,
    backgroundColor: 'rgba(255,255,255,.2)',
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  books_image: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    //backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: 30,
    opacity: 0.8,
  },
});

export default AuthScreen;
