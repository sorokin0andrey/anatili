'use strict';

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MainStyle from '../styles/MainStyle';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Entypo';
import Sound from 'react-native-sound';

const AudioStatePlay = 'play';
const AudioStatePause = 'pause';
const AudioStateStop = 'stop';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadAudio: false,
      isPlaying: false,
      progress: 0,
      duration: 1,
      durationText: '0:00',
      progressText: '0:00',
    };
    this.audioState = '';
    this.enable = true;
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    //this.clearTimer();
    this.release();
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.visible) {
    //     this.setState({ isPlaying: true, ...nextProps });
    //     this.play();
    // } else {
    //     this.setState(nextProps);
    // }
  }

  changePlayState() {
    if (this.props.source !== null) {
      if (!this.enable) {
        return;
      }
      if (this.state.isPlaying) {
        this.setState({isPlaying: false});
        this.pause();
      } else {
        this.setState({isPlaying: true});
        this.play();
      }
      this.enable = false;
      setTimeout(() => {
        this.enable = true;
      }, 500);
    } else {
      Alert.alert('Упс!', 'Не удалось загрузить аудиофайл. Попробуйте позже.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  }

  play() {
    if (this.whoosh && !this.state.isPlaying) {
      this.whoosh.getCurrentTime(seconds => {
        this.whoosh.setCurrentTime(seconds);
        this.whoosh.play(success => {
          if (success) {
            this.stop();
          }
        });
        this.audioState = AudioStatePlay;
        this.playProgress();
      });
      return;
    }

    this.setState({
      isLoadAudio: true,
    });
    this.whoosh = new Sound(this.props.source, null, error => {
      if (!error && this.whoosh) {
        let duration = this.whoosh.getDuration();
        this.setState({
          isLoadAudio: false,
          duration: duration,
          durationText: this.convertTimeToText(duration),
        });
        this.whoosh.play(success => {
          if (success) {
            this.stop();
          }
        });
        this.audioState = AudioStatePlay;
        this.playProgress();
      }
      if (!this.whoosh) {
      }
      if (error) {
        Alert.alert('Упс!', 'Что то пошло не так. Не известная ошибка', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    });
  }

  pause() {
    this.audioState = AudioStatePause;
    if (!this.whoosh) {
      return;
    }
    this.whoosh.pause();
    this.clearTimer();
  }

  stop() {
    this.audioState = AudioStateStop;
    if (!this.whoosh) {
      return;
    }
    this.whoosh.stop(() => {
      this.whoosh.setCurrentTime(0);
      this.clearTimer();
      this.setState({
        isPlaying: false,
        progress: 0,
        progressText: '0:00',
        isLoadAudio: false,
      });
    });
  }

  release() {
    if (!this.whoosh) {
      return;
    }
    this.whoosh.stop();
    this.whoosh.release();
    this.whoosh = null;
    this.clearTimer();
    this.setState({
      isPlaying: false,
      progress: 0,
      progressText: '0:00',
      isLoadAudio: false,
    });
  }

  playProgress() {
    this.timer = setInterval(() => {
      this.whoosh.getCurrentTime(seconds => {
        if (
          this.state.duration >= seconds &&
          this.audioState === AudioStatePlay
        ) {
          this.setState({
            progress: seconds,
            progressText: this.convertTimeToText(seconds),
          });
        } else if (this.audioState === AudioStateStop) {
          this.setState({
            progress: 0,
            progressText: '0:00',
          });
        }
      });
    }, 0);
  }

  onSlidingComplete(seconds) {
    if (this.whoosh) {
      this.whoosh.setCurrentTime(seconds);
      if (this.audioState !== AudioStatePlay) {
        this.changePlayState();
      }
      return;
    }
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  convertTimeToText(time) {
    let time_ = Math.round(time);
    let sec = time_ % 60;
    return time_ >= 60
      ? Math.floor(time_ / 60) + ':' + (sec >= 10 ? sec : '0' + sec)
      : '0:' + (time_ >= 10 ? time_ : '0' + time_);
  }

  onValueChange(value) {
    if (this.audioState === AudioStatePlay) {
      this.changePlayState();
    }
    this.setState({
      progressText: this.convertTimeToText(value),
    });
  }

  render() {
    const {
      isPlaying,
      duration,
      progress,
      durationText,
      progressText,
      isLoadAudio,
    } = this.state;

    return (
      <View style={styles.audioPlayerStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.btnControl}
          onPress={() =>
            isLoadAudio ? this.release() : this.changePlayState()
          }>
          {isLoadAudio ? (
            <ActivityIndicator size="small" color="white" />
          ) : isPlaying ? (
            <Icon style={styles.btnControlIcon} name="controller-paus" />
          ) : (
            <Icon
              style={[styles.btnControlIcon, {left: 2}]}
              name="controller-play"
            />
          )}
        </TouchableOpacity>
        <View style={{height: 15}} />
        <View style={styles.secondRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeStyle}>{progressText}</Text>
          </View>
          <View style={styles.sliderBlock}>
            <Slider
              style={styles.sliderStyle}
              step={1}
              maximumTrackTintColor="rgba(255,255,255,.5)"
              minimumTrackTintColor="white"
              thumbTintColor="white"
              minimumValue={0}
              maximumValue={duration}
              value={progress}
              onValueChange={value => this.onValueChange(value)}
              onSlidingComplete={value => this.onSlidingComplete(value)}
            />
          </View>
          <View style={styles.timeBlock}>
            <Text
              style={[
                styles.timeStyle,
                {textAlign: 'right', justifyContent: 'flex-end'},
              ]}>
              {durationText}
            </Text>
          </View>
        </View>
        {isLoadAudio ? (
          <Text style={[styles.timeStyle, {height: 15}]}>
            загружаем аудиофайл...
          </Text>
        ) : (
          <View style={{height: 15}} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  audioPlayerStyle: {
    //flexDirection: 'row',
    alignItems: 'center',
    //paddingHorizontal: 15,
    //height: 64,
    //borderRadius: 5,
    //backgroundColor: '#f1f1f1',
  },
  secondRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'blue',
  },
  sliderStyle: {},
  btnControl: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
  },
  btnControlIcon: {
    top: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 44,
    color: 'white',
    textAlign: 'center',
  },
  timeStyle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 12,
    fontFamily: MainStyle.font,
  },
  sliderBlock: {
    flex: 6,
    paddingHorizontal: 8,
  },
  timeBlock: {
    justifyContent: 'flex-start',
    flex: 1,
  },
});

module.exports = AudioPlayer;
