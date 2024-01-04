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
  Easing,
  Linking,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Elements from '../config/elements';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import LinearGradient from 'react-native-linear-gradient';
import AboutButton from '../components/AboutButton';

const dataMain = [
  {
    id: 1,
    titleKaz: 'Мақал-мәтелдер',
    titleRus: 'Пословицы',
    image: require('../image/materialy/magiclamp_materialy-min.png'),
    color: '#F9A825',
    actionMethod: 'getProverbsList',
  },
  {
    id: 2,
    titleKaz: 'Афоризмдер',
    titleRus: 'Афоризмы',
    image: require('../image/materialy/sprout_materily-min.png'),
    color: '#8BC34A',
    actionMethod: 'getAphorismsList',
  },
  {
    id: 3,
    titleKaz: 'Тілектер',
    titleRus: 'Пожелания',
    image: require('../image/materialy/dove_materialy-min.png'),
    color: '#FF7043',
    actionMethod: 'getToastsList',
  },
  {
    id: 4,
    titleKaz: 'М. Дулатовтың әңгімелері',
    titleRus: 'Рассказы М. Дулатова',
    image: require('../image/materialy/book_materialy.png'),
    color: '#64B5F6',
    other: 'MaterialStoriesScreen',
    actionMethod: 'getStoriesList',
  },
  {
    id: 5,
    titleKaz: 'Оқушылардың аудармасындағы классиктер',
    titleRus: 'Классика в переводе учеников',
    image: require('../image/materialy/quill_materialy.png'),
    color: '#9575CD',
    other: 'MaterialStoriesScreen',
    actionMethod: 'getUshinskyList',
  },
];
const dataMainLat = [
  {
    id: 1,
    titleKaz: 'Maqal-mátelder',
    titleRus: 'Пословицы',
    image: require('../image/materialy/magiclamp_materialy-min.png'),
    color: '#F9A825',
    actionMethod: 'getProverbsList',
  },
  {
    id: 2,
    titleKaz: 'Aforızmder',
    titleRus: 'Афоризмы',
    image: require('../image/materialy/sprout_materily-min.png'),
    color: '#8BC34A',
    actionMethod: 'getAphorismsList',
  },
  {
    id: 3,
    titleKaz: 'Tіlekter',
    titleRus: 'Пожелания',
    image: require('../image/materialy/dove_materialy-min.png'),
    color: '#FF7043',
    actionMethod: 'getToastsList',
  },
  {
    id: 4,
    titleKaz: 'M. Dýlatovtyń áńgіmelerі',
    titleRus: 'Рассказы М. Дулатова',
    image: require('../image/materialy/book_materialy.png'),
    color: '#64B5F6',
    other: 'MaterialStoriesScreen',
    actionMethod: 'getStoriesList',
  },
  {
    id: 5,
    titleKaz: 'Oqýshylardyń aýdarmasyndaǵy klassıkter',
    titleRus: 'Классика в переводе учеников',
    image: require('../image/materialy/quill_materialy.png'),
    color: '#9575CD',
    other: 'MaterialStoriesScreen',
    actionMethod: 'getUshinskyList',
  },
];

class MaterialsScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: Elements._BtnLat(screenProps, () => {
      screenProps._changeLat();
      navigation.state.params._changeLat();
    }),
    tabBarOnPress: ({previousScene, scene, jumpToIndex}) => {
      const {route, index, focused} = scene;
      if (!focused) {
        jumpToIndex(index);
        navigation.state.params._checkLat();
      }
    },
    headerLeft: <View />,
  });

  constructor(props) {
    super(props);
    this.state = {
      materials: this.props.screenProps.lang_latin ? dataMainLat : dataMain,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      _changeLat: () => this._changeLat(),
      _checkLat: () => this._checkLat(),
    });
  }

  _changeLat() {
    this.setState({
      materials: this.props.screenProps.lang_latin ? dataMain : dataMainLat,
    });
  }

  _checkLat() {
    this.setState({
      materials: this.props.screenProps.lang_latin ? dataMainLat : dataMain,
    });
  }

  componentDidMount() {
    // setTimeout(() => {
    //     this.showTasks();
    //     alert('as');
    // }, 1000);
  }

  onPressMaterial(item) {
    const {materials} = this.state;
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
        if (item.other) {
          navigate(item.other, {
            title: item.titleKaz,
            user: u,
            actionMethod: item.actionMethod,
          });
        } else {
          navigate('MaterialItemScreen', {
            color: item.color,
            title: item.titleKaz,
            id: item.id,
            actionMethod: item.actionMethod,
            user: u,
          });
        }
      }
    });
  }

  _item(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onPressMaterial(item)}
        style={styles.itemBtn}>
        {/*<Animated.View style={{opacity: this.showValue[index], transform: [{scale: buttonScale}]}}>*/}
        <View style={styles.itemBtnContainer}>
          <View style={styles.textBlock}>
            <Text style={[styles.titleKaz, {color: item.color}]}>
              {item.titleKaz}
            </Text>
            <Text style={[styles.titleRus, {color: item.color}]}>
              {item.titleRus}
            </Text>
          </View>
          <View style={[styles.circleImage, {backgroundColor: item.color}]}>
            <Image source={item.image} style={styles.image} />
          </View>
        </View>

        {/*</Animated.View>*/}
      </TouchableOpacity>
    );
  }

  onPressLearnMore = () => {
    const {navigate} = this.props.navigation;
    navigate('AboutScreen');
  };

  render() {
    const {navigate} = this.props.navigation;
    const {materials} = this.state;
    return (
      <View style={styles.main}>
        <FlatList
          style={styles.list}
          //ItemSeparatorComponent={(highlighted) => <View style={[styles.separator, highlighted && {marginLeft: 0}]} />}
          keyExtractor={(item, index) => 'material_' + index}
          data={materials}
          extraData={this.state}
          renderItem={({item, index}) => this._item(item, index)}
          ListFooterComponent={() => (
            <View style={{height: 70}}>
              <View style={{height: 10}} />
              <AboutButton value="О проекте" onPress={this.onPressLearnMore} />
            </View>
          )}
          ListHeaderComponent={() => <View style={{height: 20}} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: MainStyle.BGColor2,
  },
  list: {
    //padding: 25,
  },
  separator: {
    height: 15,
  },
  itemBtn: {
    borderRadius: 5,
    marginTop: 6,
    marginBottom: 6,
    marginHorizontal: 25,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      height: 4,
    },
    //elevation: 8,
    //zIndex: 8,
  },
  itemBtnContainer: {
    overflow: 'hidden',
    backgroundColor: 'white',
    height: 90,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    marginLeft: 20,
    paddingRight: 100,
  },
  circleImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -60,
  },
  titleKaz: {
    fontFamily: MainStyle.fontMedium,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  titleRus: {
    fontFamily: MainStyle.font,
    fontSize: 13,
    opacity: 0.8,
  },
  image: {
    width: 50,
    height: 46,
    resizeMode: 'contain',
    //backgroundColor: 'red',
    left: -25,
    opacity: 0.6,
  },
});

export default MaterialsScreen;
