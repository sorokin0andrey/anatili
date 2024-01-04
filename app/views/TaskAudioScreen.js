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
  SafeAreaView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import AudioPlayer from '../components/AudioPlayer';
import AppButton from '../components/AppButton';

class TaskAudioScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    this.state = {
      audio: '',
      text: '',
      refreshing: false,
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    const {task_id, user} = this.props.navigation.state.params;
    this.getAudio(task_id, user);
  }

  getAudio(task_id, user) {
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('task_id', task_id);
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=getAudioByID',
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
        //AsyncStorage.setItem("topics", JSON.stringify(result));
        this.setState({
          audio: result,
          noConnection: false,
          refreshing: false,
          progress: false,
        });
      }
    });
  }

  startTrain(audio) {
    this.audioPlayer.release();
    const {navigate, state} = this.props.navigation;
    navigate('TaskAudio2Screen', {
      title: state.params.title,
      gradient: state.params.gradient,
      task_id: state.params.task_id,
      audio: audio,
      lifes: 3,
      user: state.params.user,
    });
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {audio, text, progress} = this.state;
    return (
      <LinearGradient
        colors={state.params.gradient}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{height: MainStyle.headerHeight + MainStyle.statusBarHeight}}
          />

          {progress ? (
            <Preloader color="white" />
          ) : (
            <View style={styles.container}>
              <Text style={styles.context}>
                Прослушайте текст и {'\n'}приступите к заданию
              </Text>
              <AudioPlayer
                source={audio.audioUrl}
                onRef={ref => (this.audioPlayer = ref)}
              />
              <AppButton
                //style={{height: 34, alignSelf: 'center'}}
                value="Тренировать"
                onPress={() => this.startTrain(audio)}
              />
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  context: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
});

export default TaskAudioScreen;
