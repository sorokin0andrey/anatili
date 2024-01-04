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
  Modal,
  ImageBackground,
  Alert,
  RefreshControl,
} from 'react-native';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';

const data = [
  {id: 1, name: 'Lebron James', rating: 3002},
  {id: 2, name: 'Слава', rating: 2901},
  {id: 3, name: 'Берик', rating: 1988},
  {id: 4, name: 'Арсен', rating: 1799},
  {id: 5, name: 'Вы', rating: 1005},
  {id: 6, name: 'Грек', rating: 1003},
  {id: 7, name: 'Сосо', rating: 999},
  {id: 8, name: 'Ники Минаж', rating: 704},
  {id: 9, name: 'Егор', rating: 0},
];

class RatingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,

      ratingList: [],
      progress: true,
      refreshing: false,
      noConnection: false,
    };
  }

  componentDidMount() {
    this.getRatingList(this.state.user);
  }

  getRatingList(user) {
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getUsersRating',
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
        if (result.error || result.length === 0) {
          Alert.alert(null, result.error[0], [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          this.props.navigation.goBack(null);
        } else {
          this.setState({
            ratingList: result,
            refreshing: false,
            noConnection: false,
            progress: false,
          });
        }
      }
    });
  }

  _item(item, index) {
    return (
      <View
        style={[
          styles.itemStyle,
          {
            backgroundColor:
              item.name === 'Вы' ? MainStyle.inputColorSuccess : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.headerTableText,
            {
              flex: 1,
              fontWeight: 'normal',
              fontSize: 12,
              color: 'grey',
              textAlign: 'center',
            },
          ]}
          numberOfLines={1}>
          {index + 1}
        </Text>
        <Text
          style={[
            styles.headerTableText,
            {flex: 6, fontWeight: 'normal', paddingHorizontal: 10},
          ]}
          numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.headerTableText, {textAlign: 'right', flex: 2}]}>
          {item.rating}
        </Text>
      </View>
    );
  }

  render() {
    const {ratingList, progress, user, refreshing} = this.state;
    return (
      <View style={styles.main}>
        <View style={styles.headerTable}>
          <Text
            style={[styles.headerTableText, {flex: 1, textAlign: 'center'}]}
            numberOfLines={1}>
            №
          </Text>
          <Text
            style={[styles.headerTableText, {flex: 6, paddingHorizontal: 10}]}
            numberOfLines={1}>
            Имя
          </Text>
          <Text style={[styles.headerTableText, {textAlign: 'right', flex: 2}]}>
            Баллы
          </Text>
        </View>
        {progress ? (
          <Preloader />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[MainStyle.AppColorBlue]}
                tintColor={MainStyle.AppColorBlue}
                refreshing={refreshing}
                onRefresh={() => this.getRatingList(user)}
              />
            }
            style={styles.listLessons}
            ItemSeparatorComponent={highlighted => (
              <View
                style={[styles.separator, highlighted && {marginLeft: 0}]}
              />
            )}
            keyExtractor={(item, index) => 'ratingItem_' + index}
            data={ratingList}
            renderItem={({item, index}) => this._item(item, index)}
            ListFooterComponent={() => <View style={{height: 20}} />}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: MainStyle.BGColor,
  },
  headerTable: {
    height: 50,
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTableText: {
    color: MainStyle.FontColor,
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  itemStyle: {
    paddingHorizontal: 15,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RatingScreen;
