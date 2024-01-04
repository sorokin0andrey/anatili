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
  SectionList,
  RefreshControl,
  Modal,
  ImageBackground,
  Alert,
  Linking,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Elements from '../config/elements';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import AboutButton from '../components/AboutButton';

const data = [
  {
    id: 1,
    title: 'Раздел 1',
    data: [
      {
        themeKaz: 'Етістік',
        themeRus: 'глагол',
        gradient: ['#7CB342', '#C5E1A5'],
      },
      {
        themeKaz: 'Сан есім',
        themeRus: 'имя числительное',
        gradient: ['#7CB342', '#C5E1A5'],
      },
      {
        themeKaz: 'Зат есім',
        themeRus: 'существительное',
        gradient: ['#7CB342', '#C5E1A5'],
      },
    ],
  },
  {
    id: 2,
    title: 'Раздел 2',
    data: [
      {
        themeKaz: 'Етістік',
        themeRus: 'глагол',
        gradient: ['#3949AB', '#9FA8DA'],
      },
      {
        themeKaz: 'Сан есім',
        themeRus: 'имя числительное',
        gradient: ['#3949AB', '#9FA8DA'],
      },
      {
        themeKaz: 'Зат есім',
        themeRus: 'существительное',
        gradient: ['#3949AB', '#9FA8DA'],
      },
      {
        themeKaz: 'Зат есім',
        themeRus: 'существительное',
        gradient: ['#3949AB', '#9FA8DA'],
      },
    ],
  },
];

const data2 = [
  {
    data: [
      {
        color: '#9150dd',
        difficult: 0,
        id: 399,
        isCompleted: 0,
        themeKaz: 'Қазақ тілінің ерекшеліктері',
        themeRus: 'Особенности казахского языка',
      },
      {
        color: '#5c6abc',
        difficult: 0,
        id: 403,
        isCompleted: 0,
        themeKaz: 'Тәуелдік жалғау',
        themeRus: ' Форма принадлежности',
      },
      {
        color: '#238be6',
        difficult: 0,
        id: 400,
        isCompleted: 0,
        themeKaz: 'Сұраулы сөйлем',
        themeRus: 'Вопросительные предложения',
      },
    ],
    id: 292,
    title: 'Общие особенности казахского языка',
  },
  {
    data: [
      {
        color: '#00ACC1',
        difficult: 0,
        id: 402,
        isCompleted: 0,
        themeKaz: 'Зат есім',
        themeRus: 'Имя существительное',
      },
      {
        color: '#009688',
        difficult: 0,
        id: 413,
        isCompleted: 0,
        themeKaz: 'Атау септік',
        themeRus: 'Именительный падеж',
      },
      {
        color: '#4DB6AC',
        difficult: 0,
        id: 414,
        isCompleted: 0,
        themeKaz: 'Ілік септік',
        themeRus: 'Родительный падеж',
      },
      {
        color: '#43A047',
        difficult: 0,
        id: 415,
        isCompleted: 0,
        themeKaz: 'Барыс септік',
        themeRus: 'Направительно-дательный падеж',
      },
      {
        color: '#66BB6A',
        difficult: 0,
        id: 416,
        isCompleted: 0,
        themeKaz: 'Табыс септік',
        themeRus: 'Винительный падеж',
      },
      {
        color: '#7CB342',
        difficult: 0,
        id: 417,
        isCompleted: 0,
        themeKaz: 'Жатыс септік',
        themeRus: 'Местный падеж',
      },
      {
        color: '#9CCC65',
        difficult: 0,
        id: 418,
        isCompleted: 0,
        themeKaz: 'Шығыс септік',
        themeRus: 'Исходный падеж',
      },
      {
        color: '#AFB42B',
        difficult: 0,
        id: 420,
        isCompleted: 0,
        themeKaz: 'Көмектес септік',
        themeRus: 'Инструментальный падеж',
      },
      {
        color: '#CDDC39',
        difficult: '1',
        id: 423,
        isCompleted: 0,
        themeKaz: 'Септеулік шылаулар',
        themeRus: 'Послеслоги',
      },
    ],
    id: 475,
    title: 'Имя существительное',
  },
  {
    data: [
      {
        color: '#e5d829',
        difficult: 0,
        id: 405,
        isCompleted: 0,
        themeKaz: 'Етістік',
        themeRus: 'Глагол',
      },
      {
        color: '#F9A825',
        difficult: 0,
        id: 407,
        isCompleted: 0,
        themeKaz: 'Өткен шақ',
        themeRus: 'Прошедшее время',
      },
      {
        color: '#FBC02D',
        difficult: 0,
        id: 408,
        isCompleted: 0,
        themeKaz: 'Осы шақ',
        themeRus: 'Собственно-настоящее время',
      },
      {
        color: '#FB8C00',
        difficult: 0,
        id: 409,
        isCompleted: 0,
        themeKaz: 'Нақ осы шақ – (күрделі осы шақ)',
        themeRus: 'Настоящее время (сложная форма)',
      },
      {
        color: '#FFA726',
        difficult: 0,
        id: 411,
        isCompleted: 0,
        themeKaz: 'Болымсыз етістік',
        themeRus: 'Отрицательная форма глагола',
      },
      {
        color: '#FF7043',
        difficult: 0,
        id: 412,
        isCompleted: 0,
        themeKaz: 'Нақ осы шақ',
        themeRus: 'Настоящее время',
      },
      {
        color: '#E64A19',
        difficult: 0,
        id: 422,
        isCompleted: 0,
        themeKaz: 'Бұрыңғы өткен шақ',
        themeRus: 'Давно прошедшее время',
      },
    ],
    id: 474,
    title: 'Глагол и времена глагола',
  },
  {
    data: [
      {
        color: '#d32f2f',
        difficult: '1',
        id: 404,
        isCompleted: 0,
        themeKaz: 'Сан есім',
        themeRus: 'Имя числительное',
      },
      {
        color: '#C2185B',
        difficult: 0,
        id: 406,
        isCompleted: 0,
        themeKaz: 'Сын есім',
        themeRus: 'Прилагательное',
      },
      {
        color: '#7B1FA2',
        difficult: 0,
        id: 421,
        isCompleted: 0,
        themeKaz: 'Үстеу',
        themeRus: 'Наречие',
      },
    ],
    id: 293,
    title: 'Другие части речи',
  },
];

class GrammaticScreen extends Component {
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
            jumpToIndex(index);
            navigation.state.params.getUserID();
          }
        });
      }
    },
    headerRight: Elements._BtnLat(screenProps, () => {
      screenProps._changeLat();
      setTimeout(() => {
        navigation.state.params.getGrammarList();
      }, 10);
    }),
    headerLeft: <View />,
  });

  constructor(props) {
    super(props);
    this.state = {
      themes: [], //data2,
      user: {},

      progress: false,
      noConnection: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getUserID();
  }

  componentWillMount() {
    this.props.navigation.setParams({
      getUserID: () => this.getUserID(),
      getGrammarList: () => this.getGrammarList(this.state.user),
    });
  }

  getUserID() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getGrammarList(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getGrammarList(user) {
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getGrammarList',
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
          // Alert.alert(
          //     'Ошибка!',
          //     result.error[0],
          //     [
          //         {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},
          //     ]
          // );
        } else {
          this.setState({
            themes: result,
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

  goToGrammItem(item) {
    const {navigate} = this.props.navigation;
    AsyncStorage.getItem('user').then(user => {
      let u = {
        id_user: 0,
        token: '',
      };
      if (user != null) {
        u = JSON.parse(user);
      }
      if (u.id_user === 0 || u.token === '') {
        navigate('AuthScreen', {});
      } else {
        navigate('GrammaticThemeScreen', {
          difficult: item.difficult,
          title: item.themeKaz,
          color: item.color || '#999',
          id: item.id,
          user: u,
        });
      }
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

  _item(section, index) {
    const numColumns = 2;
    if (index % numColumns !== 0) {
      return null;
    }
    const items = [];
    for (let i = index; i < index + numColumns; i++) {
      if (i >= section.data.length) {
        break;
      }
      items.push(
        <TouchableOpacity
          activeOpacity={1}
          key={'item_1_' + i}
          style={[
            styles.itemStyleBtn,
            {opacity: section.data[i].access ? 1 : 0.5},
          ]}
          //onPress={() => (section.data[i].access) ? this.goToGrammItem(section.data[i]) : this.notAllowed()}>
          onPress={() => this.goToGrammItem(section.data[i])}>
          <View
            style={[
              styles.itemStyle,
              {backgroundColor: section.data[i].color || '#999'},
            ]}>
            {/*<LinearGradient*/}
            {/*colors={section.data[i].gradient}*/}
            {/*style={styles.itemStyle}*/}
            {/*start={{x: 0, y: 0}} end={{x: 1, y: 1}}>*/}
            <Text style={styles.itemTextKaz}>{section.data[i].themeKaz}</Text>
            <Text style={styles.itemTextRus}>{section.data[i].themeRus}</Text>
            {/*</LinearGradient>*/}
          </View>
        </TouchableOpacity>,
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {items}
      </View>
    );
  }

  onPressLearnMore = () => {
    const {navigate} = this.props.navigation;
    navigate('AboutScreen');
  };

  render() {
    const {navigate} = this.props.navigation;
    const {themes, progress, refreshing, user} = this.state;

    return progress ? (
      <Preloader />
    ) : (
      <View style={styles.main}>
        <SectionList
          refreshControl={
            <RefreshControl
              colors={[MainStyle.AppColorBlue]}
              tintColor={MainStyle.AppColorBlue}
              refreshing={refreshing}
              onRefresh={() => this.getGrammarList(user)}
            />
          }
          contentContainerStyle={styles.listContainerThemes}
          sections={themes}
          extraData={this.state}
          keyExtractor={(item, index) => 'theme_' + index}
          renderItem={({section, index}) => this._item(section, index)}
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          ListFooterComponent={() => (
            <View style={{height: 70}}>
              <View style={{height: 10}} />
              <AboutButton value="О проекте" onPress={this.onPressLearnMore} />
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: MainStyle.BGColor,
  },
  listContainerThemes: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  separator: {
    height: 18,
  },
  itemStyleBtn: {
    flex: 0.5,
  },
  itemStyle: {
    borderRadius: 4,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    paddingHorizontal: 15,
  },
  itemTextKaz: {
    color: 'white',
    fontFamily: MainStyle.font,
    fontSize: 16,
    textAlign: 'center',
  },
  itemTextRus: {
    color: 'rgba(255,255,255,.6)',
    fontFamily: MainStyle.font,
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    color: MainStyle.AppColorGreen,
    fontFamily: MainStyle.font,
    fontSize: 16,
    //height: 32,
    //lineHeight: 30,
    backgroundColor: MainStyle.BGColor,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default GrammaticScreen;
