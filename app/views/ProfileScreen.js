'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ImageBackground,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import Elements from '../config/elements';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import AppButton from '../components/AppButton';
import Icon from 'react-native-vector-icons/Ionicons';
import AboutButton from '../components/AboutButton';
import {NavigationActions} from 'react-navigation';

import AuthScreen from '../views/AuthScreen';

const imageBG = MainStyle.imageBG;
const data = [
  {id: 1, name: 'Флеш-тренинг №1 - Звуки кобыза', video: ''},
  {id: 2, name: 'Флеш-тренинг №2 - Звуки кобыза', video: ''},
  {id: 3, name: 'Флеш-тренинг №3 - Звуки кобыза', video: ''},
];

class ProfileScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: Elements._BtnLogOut(() => {
      Alert.alert('', 'Вы уверены, что хотите выйти из системы?', [
        {
          text: 'Выйти',
          onPress: () => {
            screenProps._signOut();
            navigation.goBack(null);
          },
        },
        {
          text: 'Отмена',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    }),
    tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
      const {route, index, focused} = scene;
      if (!focused) {
        if (screenProps.user === null) {
          navigation.navigate('AuthScreen', {});
        } else {
          jumpToIndex(index);
          navigation.state.params.getUserID();
        }
      }
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userData: {},

      name: '',
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    //this.getUserID();
    setTimeout(
      () => {
        this.setState({
          //name: data,

          progress: false,
        });
      },
      800,
      this,
    );
  }

  componentWillMount() {
    this.props.navigation.setParams({
      getUserID: () => this.getUserID(),
    });
  }

  getUserID() {
    const {navigate, goBack} = this.props.navigation;
    let {user} = this.props.screenProps;
    if (user === null) {
      user = {};
    }

    this.setState({
      progress: true,
    });

    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getUserInfo',
      formData,
      this.props.screenProps,
    ).then(result => {
      //console.log(result);
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
            userData: result,
          });
        }
        this.setState({
          noConnection: false,
          refreshing: false,
          progress: false,
        });
      }
    });
    //AsyncStorage.removeItem("user");
  }

  onPressLearnMore = () => {
    const {navigate} = this.props.navigation;
    navigate('AboutScreen');
  };

  render() {
    const {navigate} = this.props.navigation;
    const {name, progress, userData} = this.state;
    let {user} = this.props.screenProps;
    if (user === null) {
      user = {};
    }

    return (
      <View style={styles.main}>
        {user.id_user === 0 || user.token === '' ? (
          <AppButton
            style={{marginTop: 30}}
            value="Войти"
            onPress={() => navigate('AuthScreen')}
          />
        ) : (
          <ScrollView>
            <View style={{height: 25}} />
            <Text style={styles.nameInput}>Ваш e-mail</Text>
            <View style={{height: 15}} />
            <View style={styles.nameInputBlock}>
              <Text style={styles.nameInput}>
                {user.email || userData.email}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btnEdit}
              onPress={() => navigate('ChangeEmailScreen')}>
              <Text style={styles.btnEditText}>Сменить e-mail</Text>
            </TouchableOpacity>
            {/*<TextInput onChangeText={(name) => this.setState({name})}*/}
            {/*underlineColorAndroid="transparent"*/}
            {/*style={[styles.inputStyle, {top: (Platform.OS === 'ios') ? 0 : 2}]}*/}
            {/*placeholder="Имя или логин"*/}
            {/*placeholderTextColor="#999"*/}
            {/*value={name}*/}
            {/*maxLength={255}/>*/}
            <View style={{height: 25}} />

            <Text style={styles.title}>Накопленные баллы</Text>
            <Image
              source={require('../image/trophy.png')}
              style={styles.trophyImage}
            />
            {progress ? (
              <Preloader />
            ) : (
              <Text style={styles.ratingText}>{userData.rating}</Text>
            )}
            <View style={{height: 25}} />

            <AppButton
              style={{backgroundColor: '#66BB6A'}}
              value="Смотреть рейтинг"
              fontColor="white"
              underlayColor="#4CAF50"
              onPress={() => navigate('RatingScreen', {user: user})}
            />

            <View style={{height: 10}} />
            <AboutButton value="О проекте" onPress={this.onPressLearnMore} />
            {/* { user.is_payment ? null : <AboutButton value="Купить полную версию" onPress={() => navigate('PaymentScreen')}/>} */}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: MainStyle.BGColor2,
    paddingHorizontal: 25,
  },
  inputStyle: {
    backgroundColor: MainStyle.inputColor,
    color: MainStyle.FontColor,
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS !== 'android' ? 'bold' : 'normal',
    fontSize: 20,
    borderRadius: 4,
    height: 46,
    paddingHorizontal: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  nameInputBlock: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 4,
  },
  nameInput: {
    color: MainStyle.FontColor,
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS !== 'android' ? 'bold' : 'normal',
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    color: MainStyle.FontColor,
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS !== 'android' ? 'bold' : 'normal',
    fontSize: 20,
    textAlign: 'center',
  },
  trophyImage: {
    width: 76,
    height: 68,
    alignSelf: 'center',
    marginVertical: 10,
  },

  ratingText: {
    color: MainStyle.FontColor,
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
  },

  btnEdit: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  btnEditIcon: {
    //color: MainStyle.FontColor,
    fontSize: 20,
    marginRight: 10,
  },
  btnEditText: {
    color: '#66BB6A',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginRight: 10,
    textAlign: 'center',
  },
});

export default ProfileScreen;
