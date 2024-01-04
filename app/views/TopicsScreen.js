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
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import TopicComponent from '../components/TopicComponent';

const data_topics = [
  {
    id: 'family',
    image: require('../image/topics/family_icon_theme-min.png'),
  },
  {
    id: 'thermometer',
    image: require('../image/topics/thermometer_icon_theme-min.png'),
  },
  {
    id: 'maple-leaf',
    image: require('../image/topics/snowflake_icon_theme-min.png'),
  },
  {
    id: 'sofa',
    image: require('../image/topics/livingroom_icon_theme-min.png'),
  },
  {
    id: 'groceries',
    image: require('../image/topics/groceries_icon_theme-min.png'),
  },
  {
    id: 'skyscrapper',
    image: require('../image/topics/skyline_icon_theme-min.png'),
  },
  {
    id: 'human',
    image: require('../image/topics/manager_icon_theme-min.png'),
  },
  {
    id: 'bookshelf',
    image: require('../image/topics/books_icon_theme-min.png'),
  },
  {
    id: 'worker',
    image: require('../image/topics/work_icon_theme-min.png'),
  },
];

class TopicsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},

      topics: [],
      refreshing: false,
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user != null) {
        let u = JSON.parse(user);
        this.getTopics(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getTopics(user) {
    const {navigate, goBack} = this.props.navigation;
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    //formData.append('lat', 1);
    console.log(formData);
    Api.fetchData(
      Config.DOMAIN + '?action=getThemeList',
      formData,
      this.props.screenProps,
    )
      .then(result => {
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
            //AsyncStorage.removeItem("topics");
            //console.log(AsyncStorage.getItem("topics"));
            AsyncStorage.setItem('topics', JSON.stringify(result));
            for (let j = 0; j < result.length; j++) {
              for (let j2 = 0; j2 < data_topics.length; j2++) {
                if (result[j].id === data_topics[j2].id) {
                  result[j].local_url = data_topics[j2].image;
                  break;
                }
              }
            }
            this.setState({
              topics: result,
            });
          }
          this.setState({
            noConnection: false,
            refreshing: false,
            progress: false,
          });
        }
      })
      .done();
  }

  onPressTopic(cat_id) {
    const {navigate, state} = this.props.navigation;
    const {user} = this.state;
    navigate(state.params.nextScreenTask, {
      gradient: state.params.gradient,
      cat_id: cat_id,
      item: state.params.item,
      user: user,
    });
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {topics, progress, refreshing, user} = this.state;
    return (
      <View style={styles.main}>
        {progress ? (
          <Preloader />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[MainStyle.AppColorBlue]}
                tintColor={MainStyle.AppColorBlue}
                refreshing={refreshing}
                onRefresh={() => this.getTopics(user)}
              />
            }
            style={styles.listTopics}
            ItemSeparatorComponent={highlighted => (
              <View
                style={[styles.separator, highlighted && {marginLeft: 0}]}
              />
            )}
            keyExtractor={(item, index) => 'topic_' + index}
            data={topics}
            renderItem={({item, index}) => (
              <TopicComponent
                navigation={this.props.navigation}
                onPress={() => this.onPressTopic(item.cat_id)}
                item={item}
                index={index}
              />
            )}
            ListFooterComponent={() => <View style={{height: 50}} />}
            ListHeaderComponent={() => <View style={{height: 30}} />}
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
  listTopics: {},
  separator: {
    height: 10,
  },
});

export default TopicsScreen;
