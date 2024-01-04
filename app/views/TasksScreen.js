'use strict';

import React, {Component} from 'react';
import {
  AppState,
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
  Easing,
  BackHandler,
  Alert,
  Linking,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Elements from '../config/elements';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import LinearGradient from 'react-native-linear-gradient';
import TaskComponent from '../components/TaskComponent';
import {withNavigationFocus} from 'react-navigation-is-focused-hoc';
import AboutButton from '../components/AboutButton';
import VersionCheck from 'react-native-version-check';

const dataMain = [
  {
    id: 10,
    name: 'Онлайн-занятия',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/education_icon.png'),
    gradient: ['#6a85b6', '#bac8e0'],
    //gradient: ['#13547a','#80d0c7'],
    screen: 'TaskOnlineScreen',
    topics: 0,
  },
  {
    id: 1,
    name: 'Флеш-тренинг',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/flashtrening_icon.png'),
    gradient: ['#3949AB', '#9FA8DA'],
    screen: 'TaskFlashTrainingScreen',
    topics: 0,
  },
  {
    id: 2,
    name: 'Аудиоистория',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/audiolesson_icon.png'),
    gradient: ['#FF3062', '#FFB199'],
    screen: 'TaskAudioChooseScreen',
    topics: 0,
  },
  {
    id: 3,
    name: 'Перевести и собрать фразу',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/manywords_icon.png'),
    gradient: ['#429321', '#B4EC51'],
    screen: 'TaskCreateSentenceScreen',
    topics: 1,
  },
  {
    id: 4,
    name: 'Проверка знания слов',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/checkwords_icon.png'),
    gradient: ['#FB8C00', '#FFCC80'],
    screen: 'TaskCheckWordsScreen',
    topics: 1,
  },
  {
    id: 5,
    name: 'Словарные карточки',
    desc: 'русский -> казахский',
    image: require('../image/learnwords_icon.png'),
    gradient: ['#1E88E5', '#90CAF9'],
    screen: 'TaskLearnWordsScreen',
    topics: 1,
    w_lang: 'ru',
  },
  {
    id: 6,
    name: 'Словарные карточки',
    desc: 'казахский -> русский',
    image: require('../image/learnwords_icon.png'),
    gradient: ['#00ACC1', '#80DEEA'],
    screen: 'TaskLearnWordsScreen',
    topics: 1,
    w_lang: 'kz',
  },
  {
    id: 7,
    name: 'Конструктор слов',
    desc: 'Развивает восприятие казахской речи',
    image: require('../image/createword_icon.png'),
    gradient: ['#7028E4', '#E5B2CA'],
    screen: 'TaskCreateWordsScreen',
    topics: 1,
  },
];

class TasksScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: Elements._BtnLat(screenProps, () => {
      screenProps._changeLat();
    }),
  });

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      tasks: dataMain,
      id_user: 0,
      token: '',
    };
  }

  componentDidMount() {
    this.needUpdate();

    AsyncStorage.setItem('splash', '1');
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => {
        //console.log('back', this.props.navigation)
        if (this.props.isFocused) {
          Alert.alert(
            'Закрыть приложение',
            'Вы действительно хотите выйти?',
            [
              {
                text: 'Отмена',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Да', onPress: () => BackHandler.exitApp()},
            ],
            {cancelable: true},
          );
        }
        return this.props.isFocused;
      });
    }
    //this.getUserID();
    this.props.screenProps._getUserInfo();
    this.props.screenProps._getCountNewTasks();

    if (
      this.props.screenProps.dataReceivePush.type &&
      this.props.screenProps.dataReceivePush.type === '1'
    ) {
      this.props.navigation.navigate('ChatScreen');
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  needUpdate() {
    let url = Platform.select({
      ios: 'https://itunes.apple.com/kz/app/ana-tili/id1441632331',
      android: 'https://play.google.com/store/apps/details?id=com.anatili',
    });

    let cur = VersionCheck.getCurrentVersion();
    VersionCheck.getLatestVersion().then(latestVersion => {
      //console.log(cur, latestVersion);
      //console.log(parseFloat(cur) < parseFloat(latestVersion))   // 0.1.2
      if (parseFloat(cur) < parseFloat(latestVersion)) {
        Alert.alert(
          'Доступно обновление!',
          'Для получения более актуальной версии приложения, вам необходимо загрузить обновление',
          [
            {text: 'Загрузить', onPress: () => Linking.openURL(url)},
            {
              text: 'Отмена',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
        );
      }
    });
  }

  getUserID() {
    AsyncStorage.getItem('user').then(user => {
      if (user != null) {
        let u = JSON.parse(user);
        this.setState({
          user: u,
        });
      }
    });
  }

  onPressTask(item) {
    const {navigate, state} = this.props.navigation;
    AsyncStorage.getItem('user').then(user => {
      let u = {
        id_user: 0,
        token: '',
      };
      if (user != null) {
        u = JSON.parse(user);
      }
      //console.log(u);
      if (u.id_user === 0 || u.token === '') {
        navigate('AuthScreen', {
          gradient: item.gradient,
          nextScreenTask: item.screen,
          nextScreen: item.topics ? 'TopicsScreen' : item.screen,
          item: item,
        });
      } else {
        if (item.topics) {
          navigate('TopicsScreen', {
            nextScreenTask: item.screen,
            gradient: item.gradient,
            item: item,
          });
        } else {
          //if( !(item.id === 10 && !this.props.screenProps.user.is_payment) ){
          navigate(item.screen, {
            gradient: item.gradient,
            item: item,
          });
          // } else {
          //     this.notAllowed()
          // }
        }
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

  // showTasks() {
  //     let arrAnim = [];
  //     for(let i = 0; i < dataMain.length; i ++){
  //         arrAnim.push(
  //             Animated.timing(
  //                 this.showValue[i],
  //                 {
  //                     toValue: 1,
  //                     duration: 200,
  //                     //easing: Easing.easeOutBack,
  //                 }
  //             )
  //         );
  //     }
  //     Animated.stagger(100, arrAnim);
  // }

  // _itemTask(item, index){
  //     const buttonScale = this.scaleValue[index].interpolate({
  //         inputRange: [0, .33, .66, 1],
  //         outputRange: [1, .95, 1.04, 1]
  //     });
  //     // const showAnimOpacity = this.showValue[index].interpolate({
  //     //     inputRange: [0, 1],
  //     //     outputRange: [0, 1]
  //     // });
  //     return (
  //        <TouchableOpacity activeOpacity={1} onPress={() => this.onPressTask(index, {nextScreen: item.screen, gradient: item.gradient})}>
  //            <Animated.View style={{opacity: this.showValue[index], transform: [{scale: buttonScale}]}}>
  //                <LinearGradient
  //                    colors={item.gradient}
  //                    style={styles.taskStyle}
  //                    start={{x: 0.0, y: 0.0}} end={{x: 1.0, y: 1.0}}>
  //                    <View style={styles.textBlock}>
  //                        <Text style={styles.title}>{item.name}</Text>
  //                        <Text style={styles.desc}>{item.desc}</Text>
  //                    </View>
  //                    <Image source={item.image} style={styles.imageTask}/>
  //                </LinearGradient>
  //            </Animated.View>
  //        </TouchableOpacity>
  //     );
  // }

  onPressLearnMore = () => {
    const {navigate} = this.props.navigation;
    navigate('AboutScreen');
  };

  render() {
    const {navigation, screenProps} = this.props;
    const {tasks} = this.state;
    return (
      <View style={styles.main}>
        <StatusBar
          backgroundColor={MainStyle.statusBarBackgroundColor}
          barStyle="light-content"
          animated={true}
        />
        <FlatList
          style={styles.listTasks}
          ItemSeparatorComponent={highlighted => (
            <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
          )}
          keyExtractor={(item, index) => 'task_' + index}
          data={tasks}
          extraData={this.state}
          renderItem={({item, index}) => (
            <TaskComponent
              badge={item.id === 10 ? screenProps.countNewTasks : 0}
              authorised={screenProps.user ? true : false}
              index={index}
              item={item}
              onPress={() => this.onPressTask(item)}
            />
          )}
          ListFooterComponent={() => (
            <View style={{height: 70}}>
              <View style={{height: 10}} />
              <AboutButton value="О проекте" onPress={this.onPressLearnMore} />
              {/* <Button
                              onPress={this.onPressLearnMore}
                              title="О проекте"
                              color={MainStyle.AppColorBlue}
                              accessibilityLabel="Узнай больше об этом продукте"
                            /> */}
            </View>
          )}
          ListHeaderComponent={() => <View style={{height: 30}} />}
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
  listTasks: {
    //padding: 25,
  },
  separator: {
    height: 10,
  },
});

export default withNavigationFocus(TasksScreen);
