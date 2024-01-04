'use strict';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Image,
  Platform,
  Easing,
  Animated,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StackNavigator,
  NavigationActions,
  TabNavigator,
} from 'react-navigation';
import MainStyle from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import Badge from '../components/Badge';

import EmptyScreen from '../views/EmptyScreen';

import StartScreen from '../views/StartScreen';
import TasksScreen from '../views/TasksScreen';
import TopicsScreen from '../views/TopicsScreen';
import TaskFlashTrainingScreen from '../views/TaskFlashTrainingScreen';
import TaskAudioChooseScreen from '../views/TaskAudioChooseScreen';
import TaskAudioScreen from '../views/TaskAudioScreen';
import TaskAudio2Screen from '../views/TaskAudio2Screen';
import TaskCreateSentenceScreen from '../views/TaskCreateSentenceScreen';
import TaskCheckWordsScreen from '../views/TaskCheckWordsScreen';
import TaskCreateWordsScreen from '../views/TaskCreateWordsScreen';
import TaskLearnWordsScreen from '../views/TaskLearnWordsScreen';
import GrammaticScreen from '../views/GrammaticScreen';
import GrammaticThemeScreen from '../views/GrammaticThemeScreen';
import MaterialScreen from '../views/MaterialScreen';
import MaterialItemScreen from '../views/MaterialItemScreen';
import MaterialStoriesScreen from '../views/MaterialStoriesScreen';
import MaterialStoryItemScreen from '../views/MaterialStoryItemScreen';
import ProfileScreen from '../views/ProfileScreen';
import AuthScreen from '../views/AuthScreen';
import ChangeEmailScreen from '../views/ChangeEmailScreen';
import RatingScreen from '../views/RatingScreen';
import AboutScreen from '../views/AboutScreen';
import PaymentScreen from '../views/PaymentScreen';
import ChatScreen from '../views/ChatScreen';
import TaskOnlineScreen from '../views/TaskOnlineScreen';

const sizeIconsTabsHeight = Platform.OS === 'ios' ? 22 : 26;
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: MainStyle.AppColorBlue,
    height: MainStyle.headerHeight,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    // shadowColor: 'rgba(0,0,0,.5)',
    // shadowOpacity: 0.6,
    // shadowRadius: 6,
    // shadowOffset: {
    //     height: 2
    // },
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 8,
  },
  headerStyle2: {
    backgroundColor: MainStyle.AppColorBlue,
    height: MainStyle.headerHeight,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
  },
  headerStyleTrans: {
    backgroundColor: 'transparent',
    height: MainStyle.headerHeight,
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    position: 'absolute',
    width: MainStyle._width,
  },
  headerTitleStyle: {
    color: MainStyle.HeaderTintColor,
    fontFamily: Platform.OS === 'ios' ? MainStyle.font : 'sans-serif-medium',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    alignSelf: 'center',
  },
  headerTitleStyle2: {
    color: 'rgba(255,255,255,.6)',
    fontFamily: Platform.OS === 'ios' ? MainStyle.font : 'sans-serif-medium',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    fontSize: Platform.OS === 'ios' ? 14 : 17,
    alignSelf: 'center',
  },
  headerBtn: {
    paddingHorizontal: 15,
  },
  HeaderBtnText: {
    fontSize: 16,
    fontFamily: MainStyle.font,
    color: MainStyle.HeaderTintColor,
  },
  containerDrawer: {
    flex: 1,
  },
  labelStyle: {
    fontSize: 18,
    fontFamily: MainStyle.font,
    fontWeight: '300',
    padding: 0,
    marginLeft: 20,
    lineHeight: 20,
  },
  itemMenu: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabImageIcon: {
    width: Platform.OS === 'ios' ? 30 : 26,
    height: Platform.OS === 'ios' ? sizeIconsTabsHeight : 24,
    resizeMode: 'contain',
    //backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeStyle: {
    position: 'absolute',
    top: -8,
    right: -10,
  },
});

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'MainTabs'})],
});

const LeftBtnBack = navigation => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.headerBtn}
    onPress={() => navigation.goBack()}>
    <Icon
      name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'arrow-back'}
      size={34}
      color={MainStyle.HeaderTintColor}
    />
  </TouchableOpacity>
);
const CloseBtn = navigation => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.headerBtn}
    onPress={() => navigation.goBack()}>
    <Icon
      name={Platform.OS === 'ios' ? 'ios-close' : 'close'}
      size={Platform.OS === 'ios' ? 42 : 28}
      color={MainStyle.HeaderTintColor}
    />
  </TouchableOpacity>
);

// let titleUserScreen;
// AsyncStorage.getItem('user', (err, result) => {
//     if( result === null ){
//         titleUserScreen = 'Авторизация';
//     } else {
//         titleUserScreen = 'Ваш профиль';
//     }
// });

export const Tabs = TabNavigator(
  {
    TasksScreen: {
      screen: TasksScreen,
      navigationOptions: ({navigation}) => ({
        //header: null,
        headerLeft: <View />,
        title: 'Задания',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        tabBarLabel: 'Задания',
        tabBarIcon: ({focused, tintColor}) => (
          <Image
            source={require('../image/tabs/tasks_icon-min.png')}
            style={[
              styles.tabImageIcon,
              {opacity: focused ? 1 : 0.3, height: sizeIconsTabsHeight + 1},
            ]}
          />
          // <FIcon
          //     name="target"
          //     //style={styles.tabImageIcon}
          //     size={sizeIconsTabs}
          //     color={tintColor}
          // />
        ),
      }),
    },

    GrammaticScreen: {
      screen: GrammaticScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Грамматика',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        tabBarLabel: 'Грамматика',
        tabBarIcon: ({focused, tintColor}) => (
          <Image
            source={require('../image/tabs/book_icon-min.png')}
            style={[styles.tabImageIcon, {opacity: focused ? 1 : 0.3}]}
          />
          // <FIcon
          //     name="book"
          //     //style={styles.tabImageIcon}
          //     size={sizeIconsTabs}
          //     color={tintColor}
          // />
        ),
      }),
    },

    MaterialScreen: {
      screen: MaterialScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Материалы',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        tabBarLabel: 'Материалы',
        tabBarIcon: ({focused, tintColor}) => (
          <Image
            source={require('../image/tabs/archive_icon-min.png')}
            style={[
              styles.tabImageIcon,
              {opacity: focused ? 1 : 0.3, height: sizeIconsTabsHeight - 1},
            ]}
          />
          // <FIcon
          //     name="layers"
          //     //style={styles.tabImageIcon}
          //     size={sizeIconsTabs}
          //     color={tintColor}
          // />
        ),
      }),
    },

    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({navigation}) => ({
        headerLeft: <View />,
        title: 'Ваш профиль',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        tabBarLabel: 'Профиль',
        tabBarIcon: ({focused, tintColor}) => (
          <Image
            source={require('../image/tabs/profile_icon-min.png')}
            style={[styles.tabImageIcon, {opacity: focused ? 1 : 0.3}]}
          />
          // <FIcon
          //     name="user"
          //     //style={styles.tabImageIcon}
          //     size={sizeIconsTabs}
          //     color={tintColor}
          // />
        ),
      }),
    },

    Chat: {
      screen: EmptyScreen,
      path: 'chat/:id_user',
      navigationOptions: ({navigation, screenProps}) => ({
        //headerLeft: <View/>,
        //title: 'Чат',
        //headerStyle: styles.headerStyle,
        //headerTitleStyle: styles.headerTitleStyle,
        tabBarLabel: 'Консультант',
        tabBarIcon: ({focused, tintColor}) => (
          <View
            style={{
              top: Platform.select({
                ios: -11,
                android: 0,
              }),
            }}>
            <Image
              source={require('../image/tabs/message-circle.png')}
              style={[styles.tabImageIcon, {opacity: focused ? 1 : 0.3}]}
            />
            <Badge
              style={styles.badgeStyle}
              count={screenProps.countNewMessages}
            />
          </View>
        ),
      }),
    },
  },
  {
    navigationOptions: {
      headerTintColor: MainStyle.HeaderTintColor,
    },
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'rgba(255,255,255,.5)',
      //activeBackgroundColor: '#6AA638',
      //inactiveBackgroundColor: 'transparent',
      style: {
        elevation: 12,
        backgroundColor: MainStyle.AppColorGreen,
        height: Platform.OS === 'ios' ? 52 : 58,
      },
      tabStyle: {
        alignItems: 'center',
        paddingHorizontal: 0,
        //backgroundColor: 'blue',
        //height: 58,
      },
      labelStyle: {
        paddingHorizontal: 0,
        fontSize: Platform.OS === 'ios' ? 11 : 12,
        margin: 0,
        top: Platform.OS === 'ios' ? -2 : 0,
      },
      indicatorStyle: {
        height: 0,
        //backgroundColor: '#6AA638',
      },
      iconStyle: {
        width: 40,
        height: Platform.OS === 'ios' ? 30 : 28,
      },
      showIcon: true,
      upperCaseLabel: false,
    },
  },
);

export const Root = StackNavigator(
  {
    StartScreen: {
      screen: StartScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },

    MainTabs: {
      screen: Tabs,
    },

    TaskOnlineScreen: {
      screen: TaskOnlineScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },

    TopicsScreen: {
      screen: TopicsScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Выберите тему',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },

    TaskAudioChooseScreen: {
      screen: TaskAudioChooseScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Выбирете историю',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        gesturesEnabled: false,
      }),
    },

    TaskFlashTrainingScreen: {
      screen: TaskFlashTrainingScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Флеш-тренинг',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        gesturesEnabled: false,
      }),
    },
    TaskAudioScreen: {
      screen: TaskAudioScreen,
      navigationOptions: ({navigation}) => ({
        //title: 'Аудиоистория',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        gesturesEnabled: false,
      }),
    },
    TaskAudio2Screen: {
      screen: TaskAudio2Screen,
      navigationOptions: ({navigation}) => ({
        //title: 'Аудиоистория',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle2,
        //headerLeft: <View/>,
        //headerRight: LeftBtnBack( navigation ),
        gesturesEnabled: false,
      }),
    },
    TaskCreateSentenceScreen: {
      screen: TaskCreateSentenceScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Перевести и собрать фразу',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle2,
        headerLeft: <View />,
        //headerRight: LeftBtnBack( navigation ),
        gesturesEnabled: false,
      }),
    },
    TaskCheckWordsScreen: {
      screen: TaskCheckWordsScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Проверка знания слов',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle2,
        headerLeft: <View />,
        //headerRight: LeftBtnBack( navigation ),
        gesturesEnabled: false,
      }),
    },
    TaskCreateWordsScreen: {
      screen: TaskCreateWordsScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Конструктор слов',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle2,
        headerLeft: <View />,
        //headerRight: LeftBtnBack( navigation ),
        gesturesEnabled: false,
      }),
    },
    TaskLearnWordsScreen: {
      screen: TaskLearnWordsScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Словарные карточки',
        headerStyle: styles.headerStyleTrans,
        headerTitleStyle: styles.headerTitleStyle2,
        headerLeft: <View />,
        //headerRight: LeftBtnBack( navigation ),
        gesturesEnabled: false,
      }),
    },

    GrammaticThemeScreen: {
      screen: GrammaticThemeScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        //gesturesEnabled: false,
      }),
    },

    MaterialItemScreen: {
      screen: MaterialItemScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        //gesturesEnabled: false,
      }),
    },

    MaterialStoriesScreen: {
      screen: MaterialStoriesScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        //gesturesEnabled: false,
      }),
    },

    MaterialStoryItemScreen: {
      screen: MaterialStoryItemScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
        //gesturesEnabled: false,
      }),
    },

    AuthScreen: {
      screen: AuthScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Авторизация',
        headerStyle: styles.headerStyle2,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },
    ChangeEmailScreen: {
      screen: ChangeEmailScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Сменить E-mail',
        headerStyle: styles.headerStyle2,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },
    RatingScreen: {
      screen: RatingScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Рейтинг пользователей',
        headerStyle: styles.headerStyle2,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },

    AboutScreen: {
      screen: AboutScreen,
      navigationOptions: ({navigation}) => ({
        title: 'О проекте',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
        headerRight: <View />,
      }),
    },

    PaymentScreen: {
      screen: PaymentScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Оплата',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <View />,
        gesturesEnabled: false,
      }),
    },

    ChatScreen: {
      screen: ChatScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Чат',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: LeftBtnBack(navigation),
      }),
    },
  },
  {
    navigationOptions: {
      headerTintColor: MainStyle.HeaderTintColor,
    },
    cardStyle: {backgroundColor: 'white'},
    //headerMode: 'screen',
  },
);
