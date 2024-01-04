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
  Alert,
  Linking,
} from 'react-native';
import Config from '../config/config';
import Api from '../config/api';
import Preloader from '../components/Preloader';
import MainStyle from '../styles/MainStyle';

const dataMain = [
  {
    id: 1,
    titleKaz: 'Название на казахском',
    titleRus: 'Название на руссом',
  },
  {
    id: 2,
    titleKaz: 'Название на казахском',
    titleRus: 'Название на руссом',
  },
  {
    id: 3,
    titleKaz: 'Название на казахском',
    titleRus: 'Название на руссом',
  },
];

class MaterialStoriesScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    this.state = {
      stories: [],

      progress: false,
      refreshing: false,
      noConnection: false,
    };
  }

  componentDidMount() {
    this.getStoriesList();
  }

  getStoriesList() {
    const {navigate, goBack} = this.props.navigation;
    this.setState({refreshing: true});
    const {user, actionMethod} = this.props.navigation.state.params;
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);

    Api.fetchData(
      Config.DOMAIN + '?action=' + actionMethod,
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
            stories: result,
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

  onPress(item) {
    const {navigate, state} = this.props.navigation;
    navigate('MaterialStoryItemScreen', {
      title: item.kz_title,
      id: item.id,
      user: state.params.user,
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

  _item(item, index) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        //onPress={() => item.access ? this.onPress(item) : this.notAllowed()}
        onPress={() => this.onPress(item)}
        style={[styles.itemBtn, {opacity: item.access ? 1 : 0.5}]}>
        <Text style={styles.titleKaz} numberOfLines={1}>
          {item.kz_title}
        </Text>
        {/*<Text style={styles.titleRus} numberOfLines={1}>{item.ru_text}</Text>*/}
      </TouchableOpacity>
    );
  }

  render() {
    const {navigate} = this.props.navigation;
    const {stories, progress, refreshing} = this.state;
    return progress ? (
      <Preloader />
    ) : (
      <View style={styles.main}>
        <FlatList
          refreshControl={
            <RefreshControl
              tintColor={MainStyle.FontColor}
              refreshing={refreshing}
              onRefresh={() => this.getStoriesList()}
            />
          }
          style={styles.list}
          ItemSeparatorComponent={highlighted => (
            <View style={[styles.separator, highlighted && {marginLeft: 0}]} />
          )}
          keyExtractor={(item, index) => 'material_text_' + index}
          data={stories}
          extraData={this.state}
          renderItem={({item, index}) => this._item(item, index)}
          ListFooterComponent={() => <View style={{height: 30}} />}
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
  list: {
    //padding: 25,
  },
  separator: {
    height: MainStyle.separatorHeight,
    backgroundColor: MainStyle.separatorColor,
  },
  itemBtn: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
    //elevation: 8,
    //zIndex: 8,
  },
  titleKaz: {
    fontFamily: MainStyle.fontMedium,
    color: MainStyle.FontColor,
    fontSize: 17,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  titleRus: {
    fontFamily: MainStyle.font,
    color: MainStyle.FontColor,
    fontSize: 13,
    opacity: 0.8,
  },
});

export default MaterialStoriesScreen;
