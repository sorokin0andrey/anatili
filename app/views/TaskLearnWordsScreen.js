'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  Image,
  Animated,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  PixelRatio,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Functions from '../config/functions';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import FIcon from 'react-native-vector-icons/Feather';
import AppButton from '../components/AppButton';

const dataMain = [
  {
    wordStart: 'урок',
    wordEnd: 'сабақ',
    items: [
      {name: 'сабақ', correct: 1},
      {name: 'сабақ1'},
      {name: 'сабақ2'},
      {name: 'сабақ3'},
    ],
  },
  {
    wordStart: 'урок',
    wordEnd: 'сабақ',
    items: [
      {name: 'сабақ2'},
      {name: 'сабақ1'},
      {name: 'сабақ', correct: 1},
      {name: 'сабақ3'},
    ],
  },
];
const slideWidth = MainStyle._width;

class TaskLearnWordsScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.8}
        style={MainStyle.headerBtn}
        onPress={() => {
          Alert.alert(
            'Внимание!',
            'Если вы прервете задание, все ваши накопленные баллы не будут зачислены',
            [
              {
                text: 'Отмена',
                onPress: () => console.log('OK Pressed'),
                style: 'cancel',
              },
              {text: 'ОК', onPress: () => navigation.goBack()},
            ],
          );
        }}>
        <Icon name="close" size={32} color={MainStyle.HeaderTintColor} />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    this.slide = new Animated.Value(0);
    this.animateWord = [];
    this.state = {
      user: {},
      data: [], //dataMain,
      answerData: [],
      cash: 0,
      currentWordIndex: 0,
      currentWord: '',

      wrongAnswer: null,
      successAnswer: null,

      refreshing: false,
      progress: true,
      noConnection: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getLearnWords(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getLearnWords(user) {
    let formData = new FormData();
    //console.log(this.props.navigation.state.params);
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    formData.append('cat_id', this.props.navigation.state.params.cat_id);
    formData.append('w_lang', this.props.navigation.state.params.item.w_lang);
    Api.fetchData(
      Config.DOMAIN + '?action=getLearnWords',
      formData,
      this.props.screenProps,
    ).then(result => {
      console.log(result);
      if (result === 'No connection') {
        this.setState({
          noConnection: true,
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
            data: result,
            noConnection: false,
            progress: false,
          });
          this.animateSlide(0);
        }
      }
    });
  }

  animateSlide(toValue) {
    let to = (slideWidth / this.state.data.length) * (toValue + 1);
    Animated.timing(
      this.slide, // The value to drive
      {
        toValue: to, // Animate to final value of 1
        duration: 300,
      },
    ).start();
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {
      data,
      currentWord,
      currentWordIndex,
      progress,
      wrongAnswer,
      successAnswer,
      modalVisible,
      cash,
    } = this.state;

    let border = 'white',
      answered = false;
    if (wrongAnswer !== null) {
      border = '#FF5722';
      answered = true;
    } else {
      if (successAnswer !== null) {
        answered = true;
        border = '#8BC34A';
      }
    }
    let div = slideWidth / data.length;

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
          <View style={MainStyle.taskIndicator}>
            <Animated.View style={[MainStyle.stroke, {width: this.slide}]} />
            {progress
              ? null
              : data.map(function (val, index) {
                  return (
                    <View
                      key={'divider' + index}
                      style={{
                        position: 'absolute',
                        width: 4,
                        height: MainStyle.stroke.height,
                        backgroundColor: state.params.gradient[0],
                        left: (index + 1) * div - 2,
                      }}
                    />
                  );
                })}
          </View>
          <View style={{height: 20}} />

          {progress ? (
            <Preloader color="white" />
          ) : (
            <View style={styles.container}>
              <View style={{paddingHorizontal: 20}}>
                <Text style={styles.title}>Выбери правильный ответ</Text>
                <View style={{height: 20}} />

                {answered && data[currentWordIndex].url ? (
                  <View style={styles.wordImageContainer}>
                    <Image
                      style={styles.wordImage}
                      source={{uri: data[currentWordIndex].url}}
                    />
                  </View>
                ) : null}
                <View style={[styles.wordBigBlock, {borderColor: border}]}>
                  <Text style={styles.wordKaz}>
                    {data[currentWordIndex].wordStart}
                  </Text>
                  <Progress.Pie
                    borderWidth={2}
                    progress={
                      parseInt(data[currentWordIndex].correct_count) * 0.25
                    }
                    size={24}
                    color={MainStyle.AppColorGreen}
                    style={styles.progressPie}
                  />
                </View>

                <View style={{height: 5}} />
                <TouchableOpacity
                  style={styles.nextBtn}
                  activeOpacity={1}
                  onPress={() => (answered ? null : this.checkAnswer())}>
                  <Text style={styles.nextBtnText}>Далее</Text>
                  <Icon name="arrow-round-forward" style={styles.arrowRight} />
                </TouchableOpacity>
              </View>

              <View style={{height: 10}} />

              <View style={styles.words}>
                {data[currentWordIndex].items.map(function (val, index) {
                  let bgc = 'white';
                  if (wrongAnswer === index) {
                    bgc = '#FFAB91';
                  }
                  if (successAnswer === index) {
                    bgc = '#C5E1A5';
                  }
                  return (
                    <WordComponent
                      key={'word_answer_' + index}
                      bgColor={bgc}
                      value={val}
                      index={index}
                      onPress={() =>
                        answered ? null : this.checkAnswer(index)
                      }
                      onRef={ref => (this.animateWord[index] = ref)}
                    />
                  );
                }, this)}
              </View>
            </View>
          )}
        </SafeAreaView>

        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => null}
          visible={modalVisible}>
          <View style={styles.modalBox}>
            {cash === 0 ? (
              <View style={styles.modalBoxContent}>
                <Icon name="sad-outline" style={styles.errorIconResult} />
                <View style={{height: 30}} />
                <Text style={styles.textResult}>
                  К сожалению, тебе не удалось заработать баллы.
                </Text>
              </View>
            ) : (
              <View style={styles.modalBoxContent}>
                <Icon
                  name="checkmark-circle-outline"
                  style={[styles.errorIconResult, {color: 'green'}]}
                />
                <View style={{height: 30}} />
                <Text style={styles.textResult}>Отлично!</Text>
                <Text style={styles.textResult}>Ты заработал(а)</Text>
                <View style={{height: 20}} />
                <Text style={styles.cash}>{cash}</Text>
                <Text style={styles.textResultSub}>
                  {Functions.sklonenie(cash, 'балл', 'балла', 'баллов')}
                </Text>
              </View>
            )}

            <AppButton
              style={styles.btnResultContinue}
              value={cash === 0 ? 'Еще раз' : 'Продолжить'}
              onPress={() => this.repeatTask()}
            />
            <View style={{height: 15}} />
            <AppButton
              style={styles.btnResultContinue}
              value="Завершить задание"
              onPress={() => this.endTask()}
            />
          </View>
        </Modal>
      </LinearGradient>
    );
  }

  checkAnswer(index) {
    const {data, currentWordIndex, cash, answerData, user} = this.state;
    let successAnswer = null;
    let wrongAnswer = null;
    let cash_ = cash;
    let answerData_ = answerData;

    let formLog = new FormData();
    formLog.append('user_id', user.id_user);
    formLog.append('user_token', user.token);
    formLog.append('game_id', data[currentWordIndex].game_id);
    formLog.append(
      'success',
      index !== undefined && data[currentWordIndex].items[index].correct === 1
        ? 1
        : 0,
    );
    formLog.append('id', data[currentWordIndex].id);
    formLog.append('skip', index === undefined ? 1 : 0);
    formLog.append('data', JSON.stringify({sestenceUser: [index]}));
    console.log(formLog);
    Api.fetchData(
      Config.DOMAIN + '?action=wordsCartCompletedLog',
      formLog,
      this.props.screenProps,
    ).then(result => {
      console.log(result);
      if (result === 'No connection') {
        this.setState({
          noConnection: true,
          progress: false,
        });
      } else {
        this.setState({
          noConnection: false,
          progress: false,
        });
      }
    });

    if (
      index !== undefined &&
      data[currentWordIndex].items[index].correct === 1
    ) {
      data[currentWordIndex].correct_count += 1;
      successAnswer = index;
      cash_ += parseInt(data[currentWordIndex].multiplier);
      answerData_.push(data[currentWordIndex].id);
    } else {
      wrongAnswer = index;
      for (let i = 0; i < data[currentWordIndex].items.length; i++) {
        if (data[currentWordIndex].items[i].correct === 1) {
          successAnswer = i;
        }
      }
    }

    this.setState({
      cash: cash_,
      wrongAnswer: wrongAnswer,
      successAnswer: successAnswer,
      answerData: answerData_,
    });

    //alert(answerData_);

    setTimeout(() => {
      //alert(successAnswer);
      let cur = currentWordIndex + 1;
      if (cur === data.length) {
        //alert(answerData_);
        // Alert.alert(
        //     'Задания закончились!',
        //     '',
        //     [
        //         {text: 'OK', onPress: () => console.log('OK Pressed')},
        //     ]
        // );
        this.setState({
          modalVisible: true,
          wrongAnswer: null,
          successAnswer: null,
        });

        let formData = new FormData();
        formData.append('user_id', user.id_user);
        formData.append('user_token', user.token);
        formData.append('cash', cash_);
        formData.append('word_id', JSON.stringify(answerData_));
        console.log(formData);
        Api.fetchData(
          Config.DOMAIN + '?action=learnWordsCompleted',
          formData,
          this.props.screenProps,
        ).then(result => {
          console.log(result);
          if (result === 'No connection') {
            this.setState({
              noConnection: true,
            });
          } else {
            this.setState({
              noConnection: false,
            });
          }
        });
      } else {
        this.animateSlide(cur);
        this.setState({
          currentWordIndex: cur,
          wrongAnswer: null,
          successAnswer: null,
        });
        for (let i = 0; i < data[cur].items.length; i++) {
          this.animateWord[i].animate();
        }
      }
    }, 2000);
  }

  nextWord() {}

  repeatTask() {
    const {goBack, navigate, state} = this.props.navigation;
    goBack(null);
    navigate('TaskLearnWordsScreen', {
      gradient: state.params.gradient,
      cat_id: state.params.cat_id,
      item: state.params.item,
    });
  }

  endTask() {
    this.setState({
      modalVisible: false,
    });
    this.props.navigation.goBack(null);
    this.props.navigation.goBack(null);
  }
}

class WordComponent extends Component {
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

  animate() {
    const {index} = this.props;
    this.showValue.setValue(0);
    Animated.spring(this.showValue, {
      useNativeDriver: true,
      toValue: 1,
      tension: 50,
      friction: 5,
      //duration: 500,
      delay: index * 250,
      //easing: Easing.easeOut
    }).start();
  }

  render() {
    const {value, onPress, bgColor} = this.props;
    const buttonScale = this.showValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1],
    });
    // const buttonX = this.showValue.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [60, 0]
    // });
    return (
      <Animated.View
        style={[
          {
            opacity: this.showValue,
            transform: [{scale: buttonScale}],
          },
          {alignSelf: 'stretch', marginHorizontal: 20},
        ]}>
        <TouchableOpacity
          style={[styles.symbolBtnContainer, {backgroundColor: bgColor}]}
          activeOpacity={1}
          onPress={() => onPress()}>
          <Text style={styles.symbolBtnText}>{value.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    //paddingHorizontal: 20,
  },
  title: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'center',
  },
  wordBigBlock: {
    height: 160,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 5,
    paddingHorizontal: 20,
  },
  wordImageContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    top: 30,
    position: 'absolute',
    zIndex: 100,
    alignSelf: 'center',
  },
  wordImage: {
    width: 50,
    height: 50,
  },
  wordKaz: {
    fontFamily: MainStyle.font,
    fontSize: 20,
    color: MainStyle.AppColorGreen,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wordRus: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: MainStyle.AppColorGreen,
    textAlign: 'center',
    position: 'absolute',
    bottom: 15,
  },
  progressPie: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  nextBtn: {
    width: 85,
    alignSelf: 'flex-end',
    height: 40,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextBtnText: {
    fontFamily: MainStyle.font,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  arrowRight: {
    fontSize: 16,
    color: 'white',
    borderWidth: 2,
    borderColor: 'white',
    width: 22,
    height: 22,
    lineHeight: Platform.OS === 'ios' ? 18 : 22,
    borderRadius: 11,
    textAlign: 'center',
  },
  words: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  symbolBtnContainer: {
    alignSelf: 'stretch',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  symbolBtnText: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: MainStyle.AppColorGreen,
    textAlign: 'center',
  },

  modalBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.9)',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBoxContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconResult: {
    color: 'red',
    fontSize: 80,
  },
  textResult: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  textResultSub: {
    fontFamily: MainStyle.font,
    fontSize: 14,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'center',
  },
  btnResultContinue: {
    //margin: 30,
  },
  cash: {
    fontSize: 52,
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default TaskLearnWordsScreen;
