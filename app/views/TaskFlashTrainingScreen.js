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
  TouchableHighlight,
  FlatList,
  RefreshControl,
  Modal,
  PixelRatio,
  Alert,
  ImageBackground,
  InteractionManager,
  SafeAreaView,
  Linking,
} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../components/AppButton';
import Icon from 'react-native-vector-icons/Entypo';
//import YouTube, { YouTubeStandaloneAndroid, YouTubeStandaloneIOS } from 'react-native-youtube';

const data = [
  {
    id: 1,
    title: 'title 1',
    id_video: 'FWSa7jGvdeE',
  },
  {
    id: 2,
    title: 'title 2',
    id_video: 'FWSa7jGvdeE',
  },
  {
    id: 3,
    title: 'title 3',
    id_video: 'FWSa7jGvdeE',
  },
];

class TaskFlashTrainingScreen extends Component {
  constructor(props) {
    super(props);
    this.animateVideo = [];
    this.state = {
      user: {},
      videos: data,
      refreshing: false,
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem('user').then(user => {
        if (user !== null) {
          let u = JSON.parse(user);
          this.getVideos(u);
          this.setState({
            user: u,
          });
        }
      });
    });
  }

  getVideos(user) {
    const {navigate, goBack} = this.props.navigation;
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getFlashTrainingList',
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
            videos: result,
            noConnection: false,
            refreshing: false,
            progress: false,
          });
        }
      }
    });
  }

  _itemVideo(item, index) {
    //const { navigate } = this.props.navigation;
    //let arr = item.acf.youtube_link.split('/');
    //let id_video = arr[arr.length - 1];
    return (
      <VideoComponent
        navigation={this.props.navigation}
        item={item}
        index={index}
        onRef={ref => (this.animateVideo[index] = ref)}
      />
    );
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {videos, progress, refreshing, user} = this.state;
    return (
      <LinearGradient
        colors={state.params.gradient}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        <StatusBar
          backgroundColor={state.params.gradient[0]}
          barStyle="light-content"
          animated={true}
        />
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{height: MainStyle.headerHeight + MainStyle.statusBarHeight}}
          />
          <View style={styles.container}>
            {progress ? (
              <Preloader color="white" />
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    tintColor="white"
                    refreshing={refreshing}
                    onRefresh={() => this.getVideos(user)}
                  />
                }
                style={styles.listVideos}
                keyExtractor={(item, index) => 'video_' + index}
                data={videos}
                renderItem={({item, index}) => this._itemVideo(item, index)}
                ListFooterComponent={() => <View style={{height: 25}} />}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

class VideoComponent extends Component {
  constructor(props) {
    super(props);
    //this.scaleValue = new Animated.Value(0);
    this.showValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.props.onRef(this);
    this.animate();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  // playVideo(id_video) {
  //     YouTubeStandaloneAndroid.playVideo({
  //         apiKey: 'xAIzaSyB-F_zu0CbRWNzZYCZyCECCwfd-ZYCQwAE',     // Your YouTube Developer API Key
  //         videoId: id_video,     // YouTube video ID
  //         autoplay: true,             // Autoplay the video
  //         startTime: 0,             // Starting point of video (in seconds)
  //     })
  //         .then(() => console.log('Standalone Player Exited'))
  //         .catch(errorMessage => console.error(errorMessage))
  // }

  // playVideo(id_video){
  //     {Platform.OS==='ios' ?
  //     YouTubeStandaloneIOS.playVideo(id_video)
  //                   .then(() => console.log('iOS Standalone Player Finished'))
  //                   .catch(errorMessage => console.error(errorMessage)) : null
  //                 }
  //      {Platform.OS==='android' ?
  //      YouTubeStandaloneAndroid.playVideo({
  //         apiKey: 'xAIzaSyB-F_zu0CbRWNzZYCZyCECCwfd-ZYCQwAE',
  //         videoId: id_video,
  //         autoplay: true,
  //         startTime: 0,
  //       })
  //         .then(() => console.log('Standalone Player Exited'))
  //         .catch(errorMessage => console.error(errorMessage)):null}
  // }

  animate() {
    const {index} = this.props;
    this.showValue.setValue(0);
    Animated.spring(this.showValue, {
      useNativeDriver: true,
      toValue: 1,
      tension: 50,
      friction: 5,
      //duration: 500,
      delay: index * 200,
      //easing: Easing.easeOut
    }).start();
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

  render() {
    const {item, onPress} = this.props;
    const showTaskX = this.showValue.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    if (Platform.OS === 'android') {
      return (
        <TouchableHighlight
          style={[styles.videoItemStyleBox, {opacity: item.access ? 1 : 0.5}]}
          activeOpacity={1}
          // onPress={() => item.access ? this.playVideo(item.video) : this.notAllowed()}
          //onPress={() => this.playVideo(item.video)}
          underlayColor="transparent">
          <Animated.View
            style={[
              styles.videoItemStyle,
              {
                opacity: this.showValue,
                transform: [{translateX: showTaskX}],
              },
            ]}>
            <ImageBackground source={{uri: item.img}} style={styles.video}>
              <View style={styles.btnControl}>
                <Icon
                  style={[styles.btnControlIcon, {left: 2}]}
                  name="controller-play"
                />
              </View>
              <WebView
                useWebKit={true}
                style={[styles.WebViewContainer, {opacity: 0}]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                //source={{uri: item.acf.youtube_link }}
                source={{uri: 'https://www.youtube.com/embed/' + item.video}}
              />
              <View
                style={[
                  styles.video,
                  {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    width: MainStyle._width - 50,
                  },
                ]}
              />
            </ImageBackground>
            <Text style={styles.videoName}>{item.title}</Text>
          </Animated.View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          style={[styles.videoItemStyleBox, {opacity: item.access ? 1 : 0.5}]}
          activeOpacity={1}
          //onPress={() => item.access ? null : this.notAllowed()}
          underlayColor="transparent">
          <Animated.View
            style={[
              styles.videoItemStyle,
              {
                opacity: this.showValue,
                transform: [{translateX: showTaskX}],
              },
            ]}>
            <ImageBackground source={{uri: item.img}} style={styles.video}>
              {/* <View style={styles.btnControl}>
                                <Icon style={[styles.btnControlIcon, { left: 2 }]} name="controller-play" />
                            </View> */}
              <WebView
                useWebKit={true}
                style={[styles.WebViewContainer, {opacity: 0}]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                //source={{uri: item.acf.youtube_link }}
                source={{uri: 'https://www.youtube.com/embed/' + item.video}}
              />
            </ImageBackground>
            <Text style={styles.videoName}>{item.title}</Text>
          </Animated.View>
        </TouchableHighlight>
      );
    }
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  videoItemStyleBox: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
  videoItemStyle: {
    borderRadius: 6,
    backgroundColor: 'white',
  },
  video: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: 160,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoName: {
    color: '#424242',
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  WebViewContainer: {
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    width: MainStyle._width - 50,
    height: 160,
  },

  btnControl: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'white',
    // borderWidth: 3,
  },
  btnControlIcon: {
    top: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 44,
    color: MainStyle.FontColor,
    textAlign: 'center',
  },
});

export default TaskFlashTrainingScreen;
