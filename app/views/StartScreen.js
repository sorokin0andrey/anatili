'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Keyboard,
  Animated,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import Api from '../config/api';
import Config from '../config/config';
import MainStyle from '../styles/MainStyle';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../components/AppButton';
import Icon from 'react-native-vector-icons/Entypo';
import {NavigationActions} from 'react-navigation';

let getSplashSuccess = false;

class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.slide = new Animated.Value(0);
    this.slide2 = new Animated.Value(0);
    this.state = {};
  }

  componentDidMount() {
    //AsyncStorage.removeItem("splash");
    //AsyncStorage.removeItem("user");
    // let user = {
    //     id_user: 1034,
    //     token: "55D552h6fsfyketH3iQk4Yfbbbbb",
    //     email: "dan.t.a@mail.ru",
    //     is_payment: 0
    // };
    //AsyncStorage.setItem('user', JSON.stringify(user))

    setTimeout(() => {
      // let u = {}
      // AsyncStorage.getItem("user").then((user) => {
      //     if (user != null) {
      //         u = JSON.parse(user);
      //         //console.log(u)
      //         let formData = new FormData();
      //         formData.append('user_id', u.id_user);
      //         formData.append('user_token', u.token);
      //         formData.append('is_payment', u.is_payment);
      //         Api.fetchData( Config.DOMAIN + '?action=getUserInfo', formData, this.props.screenProps).then((result) => {
      //             if(result.error){
      //                 if(result.code === 401){
      //                     AsyncStorage.removeItem("user");
      //                 }
      //             }
      //         })
      //     }
      // });

      this.getSplashValue();
      SplashScreen.hide();
    }, 400);
  }

  getSplashValue() {
    if (!getSplashSuccess) {
      this.redirect();
      // AsyncStorage.getItem('splash').then((value) => {

      //     if (value !== null){
      //         this.redirect();
      //     } else {
      //         this.animatePage();

      //     }

      // });
      getSplashSuccess = true;
    } else {
      this.animatePage();
    }
  }

  redirect() {
    const resetAction1 = NavigationActions.reset({
      index: 0,
      //key: null,
      actions: [NavigationActions.navigate({routeName: 'MainTabs'})],
    });
    this.props.navigation.dispatch(resetAction1);
  }

  goToMainScreen() {
    this.redirect();
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

  animatePage() {
    this.slide.setValue(0);
    Animated.spring(
      this.slide, // The value to drive
      {
        useNativeDriver: true,
        toValue: 1,
        tension: 50,
        friction: 5,
        delay: 500,
      },
    ).start();
  }

  animatePage2() {
    this.slide2.setValue(0);
    Animated.spring(
      this.slide2, // The value to drive
      {
        useNativeDriver: true,
        toValue: 1,
        tension: 50,
        friction: 5,
        //delay: 2000,
      },
    ).start();
  }

  nextPage() {
    this.scrollComponent.scrollTo({x: MainStyle._width, y: 0, animated: true});
    this.animatePage2();
  }

  render() {
    const {dispatch, navigate} = this.props.navigation;
    const x1 = this.slide.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
    });
    const x2 = this.slide.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });
    const x3 = this.slide.interpolate({
      inputRange: [0, 1],
      outputRange: [120, 0],
    });
    const x4 = this.slide.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 0],
    });

    const x5 = this.slide2.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 0],
    });
    const x6 = this.slide2.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });
    const x7 = this.slide2.interpolate({
      inputRange: [0, 1],
      outputRange: [120, 0],
    });

    return (
      <LinearGradient
        colors={[MainStyle.AppColorBlue, '#0097A7']}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        <StatusBar
          backgroundColor={MainStyle.statusBarBackgroundColor}
          barStyle="light-content"
          animated={true}
        />

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scrollStyle}
          scrollEnabled={false}
          pagingEnabled
          ref={component => (this.scrollComponent = component)}>
          <View style={styles.page1}>
            <Animated.Image
              source={require('../image/splash_image.png')}
              style={[
                styles.topImage,
                {opacity: this.slide, transform: [{translateX: x1}]},
              ]}
            />
            <View style={{height: 25}} />
            <Animated.View
              style={{opacity: this.slide, transform: [{translateX: x2}]}}>
              <Text style={styles.title}>Добро пожаловать!</Text>
            </Animated.View>
            <View style={{height: 15}} />
            <Animated.View
              style={{opacity: this.slide, transform: [{translateX: x3}]}}>
              <Text style={styles.sText}>
                Приложение «Ана тілі» поможет вам быстро и эффективно изучить
                казахский язык
              </Text>
            </Animated.View>
            <View style={{height: 50}} />
            <Animated.View
              style={[
                {alignSelf: 'stretch'},
                {opacity: this.slide, transform: [{translateX: x4}]},
              ]}>
              <AppButton
                //style={{height: 34, alignSelf: 'center'}}
                value="Продолжить"
                //onPress={() => this.nextPage()}/>
                onPress={() => this.goToMainScreen(this.props.navigation)}
              />
            </Animated.View>
          </View>

          {/*<View style={styles.page1}>*/}
          {/*<Animated.View style={{opacity: this.slide2, transform: [{translateX: x5}] }}>*/}
          {/*<Text style={styles.title}>*/}
          {/*Посмотрите{'\n'}всупительное видео*/}
          {/*</Text>*/}
          {/*</Animated.View>*/}
          {/*<View style={{height: 30}}/>*/}
          {/*<Animated.View style={[styles.videoBox, {opacity: this.slide2, transform: [{translateX: x6}] } ]}>*/}
          {/*<WebView*/}
          {/*style={ styles.WebViewContainer }*/}
          {/*javaScriptEnabled={true}*/}
          {/*domStorageEnabled={true}*/}
          {/*//source={{uri: item.acf.youtube_link }}*/}
          {/*source={{uri: 'https://www.youtube.com/embed/' + '0cz4ryyfzzA' }}*/}
          {/*/>*/}
          {/*{*/}
          {/*(Platform.OS === 'android') ? <View style={{*/}
          {/*position: 'absolute' ,*/}
          {/*backgroundColor: 'transparent',*/}
          {/*width: MainStyle._width - 80,*/}
          {/*height: 180}}/> : null*/}
          {/*}*/}
          {/*{*/}
          {/*(Platform.OS === 'android') ? <TouchableOpacity*/}
          {/*activeOpacity={1}*/}
          {/*style={styles.playCont}*/}
          {/*onPress={() => this.playVideo('0cz4ryyfzzA')}>*/}
          {/*<Icon name="controller-play" style={styles.playIcon}/>*/}
          {/*</TouchableOpacity> : null*/}

          {/*}*/}

          {/*</Animated.View>*/}
          {/*<View style={{height: 80}}/>*/}
          {/*<Animated.View style={[{alignSelf: 'stretch'}, {opacity: this.slide2, transform: [{translateX: x7}] }]}>*/}
          {/*<AppButton*/}
          {/*//style={{height: 34, alignSelf: 'center'}}*/}
          {/*value="Пропустить"*/}
          {/*onPress={() => this.goToMainScreen(this.props.navigation)}/>*/}
          {/*</Animated.View>*/}
          {/*</View>*/}
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    //backgroundColor: MainStyle.AppColorBlue,
    //justifyContent: 'center',
  },
  scrollStyle: {
    //flex: 1,
    alignItems: 'center',
    //flexDirection: 'row',
  },
  title: {
    fontFamily: MainStyle.fontMedium,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  page1: {
    flex: 1,
    paddingHorizontal: 40,
    alignItems: 'center',
    flexDirection: 'column',
    width: MainStyle._width,
  },
  sText: {
    fontFamily: MainStyle.font,
    color: 'rgba(255,255,255,.6)',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  topImage: {
    opacity: 0,
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  WebViewContainer: {
    opacity: 0.2,
    width: MainStyle._width - 80,
    //alignSelf: 'stretch',
    height: 180,
  },
  videoBox: {
    opacity: 0,
    alignSelf: 'stretch',
    height: 180,
    backgroundColor: 'rgba(255,255,255,.4)',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  playCont: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 60,
    color: MainStyle.AppColorGreen,
    textAlign: 'center',
    lineHeight: 80,
    left: 3,
  },
});

export default StartScreen;
