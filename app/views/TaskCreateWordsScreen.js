'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
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
import AppButton from '../components/AppButton';

const dataMain_ = [
  {
    wordRus: 'урок',
    wordKaz: 'сабақ',
    symbols: [
      {name: 'c', count: 1},
      {name: 'қ', count: 1},
      {name: 'а', count: 2},
      {name: 'б', count: 1},
    ],
  },
  {
    wordRus: 'урок',
    wordKaz: 'сабақ',
    symbols: [
      {name: 'c', count: 1},
      {name: 'қ', count: 1},
      {name: 'а', count: 2},
      {name: 'б', count: 1},
    ],
  },
];
const slideWidth = MainStyle._width;

class TaskCreateWordsScreen extends Component {
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
    this.animateSymbols = [];
    this.animation = false;
    this.slide = new Animated.Value(0);
    this.animateWrongWord = new Animated.Value(0);
    this.state = {
      user: {},
      data: [], //dataMain_,
      dataMain: [],
      answerData: [],
      currentWordIndex: 0,
      currentWord: '',
      countErrors: 0,
      refreshing: false,
      progress: true,
      noConnection: false,
      cash: 0,
      modalVisible: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getConstructWords(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getConstructWords(user) {
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    formData.append('cat_id', this.props.navigation.state.params.cat_id);
    Api.fetchData(
      Config.DOMAIN + '?action=getConstructWords',
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
            dataMain: JSON.parse(JSON.stringify(result)),
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
      dataMain,
      currentWord,
      currentWordIndex,
      progress,
      countErrors,
      modalVisible,
      cash,
    } = this.state;
    let div = slideWidth / data.length;

    let border = 'white';
    if (data.length !== 0 && data[currentWordIndex].symbols.length === 0) {
      if (countErrors > 1) {
        border = '#FF5722';
      } else {
        border = '#8BC34A';
      }
    }

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
              <Text style={styles.title}>Собери слово</Text>
              <View style={{height: 20}} />

              <View style={[styles.wordBigBlock, {borderColor: border}]}>
                {data[currentWordIndex].symbols.length === 0 &&
                data[currentWordIndex].url ? (
                  <Image
                    style={styles.wordImage}
                    source={{uri: data[currentWordIndex].url}}
                  />
                ) : null}
                {currentWord === '' ? (
                  <Text style={styles.wordKazNull}>Собери слово из букв</Text>
                ) : (
                  <Text style={styles.wordKaz}>{currentWord}</Text>
                )}
                <Text style={styles.wordRus}>
                  {data[currentWordIndex].wordRus}
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
              {data[currentWordIndex].symbols.length === 0 ? null : (
                <TouchableOpacity
                  style={styles.nextBtn}
                  activeOpacity={1}
                  onPress={() => this.nextWord()}>
                  <Text style={styles.nextBtnText}>Не знаю</Text>
                  <Icon name="help" style={styles.arrowRight} />
                </TouchableOpacity>
              )}
              <View style={{height: 25}} />

              <View style={styles.words}>
                {data[currentWordIndex].symbols.map(function (val, index) {
                  return (
                    <SymbolComponent
                      value={val}
                      index={index}
                      onRef={ref => (this.animateSymbols[index] = ref)}
                      onPress={() => this.pressSymbol(index)}
                      key={'symbol_' + index}
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
                <Text style={styles.textResult}>Ты заработал</Text>
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

  pressSymbol(index) {
    let {
      data,
      dataMain,
      currentWord,
      currentWordIndex,
      countErrors,
      answerData,
      cash,
      user,
    } = this.state;
    let symbol = data[currentWordIndex].symbols[index];
    let currentWord_ = currentWord + symbol.name;
    let cash_ = cash;
    let answerData_ = answerData;
    let countErrors_ = countErrors;

    if (
      data[currentWordIndex].wordKaz[currentWord_.length - 1] ===
      currentWord_[currentWord_.length - 1]
    ) {
      if (parseInt(symbol.count) > 1) {
        data[currentWordIndex].symbols[index].count =
          parseInt(symbol.count) - 1;
      } else {
        data[currentWordIndex].symbols.splice(index, 1);
      }
    } else {
      countErrors_ += 1;
      currentWord_ = currentWord;
      this.animateSymbols[index].animateWrong();
    }

    if (data[currentWordIndex].symbols.length === 0) {
      if (countErrors_ < 2) {
        data[currentWordIndex].correct_count += 1;
        answerData_.push(data[currentWordIndex].id);
        cash_ += parseInt(data[currentWordIndex].multiplier);
      }

      let formLog = new FormData();
      formLog.append('user_id', user.id_user);
      formLog.append('user_token', user.token);
      formLog.append('game_id', data[currentWordIndex].game_id);
      formLog.append('success', countErrors_ < 2 ? 1 : 0);
      formLog.append('id', data[currentWordIndex].id);
      formLog.append('skip', 0);
      formLog.append('data', JSON.stringify({sestenceUser: currentWord_}));
      console.log(formLog);
      Api.fetchData(
        Config.DOMAIN + '?action=constructCompletedLog',
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

      setTimeout(() => {
        //alert(successAnswer);
        let cur = currentWordIndex + 1;
        if (cur === data.length) {
          // Alert.alert(
          //     'Задания закончились!',
          //     '',
          //     [
          //         {text: 'OK', onPress: () => console.log('OK Pressed')},
          //     ]
          // );
          this.setState({
            modalVisible: true,
            currentWord: '',
            cash: cash_,
            answerData: answerData_,
          });

          if (answerData_.length > 0) {
            let formData = new FormData();
            formData.append('user_id', user.id_user);
            formData.append('user_token', user.token);
            formData.append('cash', cash_);
            formData.append('word_id', JSON.stringify(answerData_));
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
          }
        } else {
          this.animateSlide(cur);
          this.setState({
            currentWordIndex: cur,
            currentWord: '',
            cash: cash_,
          });
          for (let i = 0; i < dataMain[cur].symbols.length; i++) {
            this.animateSymbols[i].animate();
          }
        }
        countErrors_ = 0;
        this.setState({
          countErrors: countErrors_,
        });
      }, 2000);
    }

    this.setState({
      data: data,
      currentWord: currentWord_,
      countErrors: countErrors_,
    });
  }

  nextWord() {
    let {data, dataMain, currentWordIndex, answerData, cash, user} = this.state;

    data[currentWordIndex].symbols = [];
    this.setState({
      currentWord: data[currentWordIndex].wordKaz,
      countErrors: 100,
    });

    let formLog = new FormData();
    formLog.append('user_id', user.id_user);
    formLog.append('user_token', user.token);
    formLog.append('game_id', data[currentWordIndex].game_id);
    formLog.append('success', 0);
    formLog.append('id', data[currentWordIndex].id);
    formLog.append('skip', 1);
    formLog.append('data', JSON.stringify({sestenceUser: ''}));
    console.log(formLog);
    Api.fetchData(
      Config.DOMAIN + '?action=constructCompletedLog',
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

    setTimeout(() => {
      let cur = currentWordIndex + 1;
      if (cur === data.length) {
        this.setState({
          modalVisible: true,
          currentWord: '',
        });

        if (answerData.length > 0) {
          let formData = new FormData();
          formData.append('user_id', user.id_user);
          formData.append('user_token', user.token);
          formData.append('cash', cash);
          formData.append('word_id', JSON.stringify(answerData));
          Api.fetchData(
            Config.DOMAIN + '?action=learnWordsCompleted',
            formData,
            this.props.screenProps,
          ).then(result => {
            //console.log(result);
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
        }
      } else {
        this.animateSlide(cur);
        this.setState({
          currentWordIndex: cur,
          currentWord: '',
        });
        for (let i = 0; i < dataMain[cur].symbols.length; i++) {
          this.animateSymbols[i].animate();
        }
      }

      this.setState({
        countErrors: 0,
      });
    }, 2000);
  }

  repeatTask() {
    const {goBack, navigate, state} = this.props.navigation;
    goBack(null);
    navigate('TaskCreateWordsScreen', {
      gradient: state.params.gradient,
      cat_id: state.params.cat_id,
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

class SymbolComponent extends Component {
  constructor(props) {
    super(props);
    //this.scaleValue = new Animated.Value(0);
    this.showValue = new Animated.Value(0);
    this.animateWrongWord = new Animated.Value(0);
    this.animation = false;
    this.state = {
      animation: false,
    };
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

  animateWrong() {
    this.setState({animation: true});
    this.animateWrongWord.setValue(0);
    Animated.timing(
      this.animateWrongWord, // The value to drive
      {
        toValue: 1, // Animate to final value of 1
        duration: 300,
      },
    ).start(() => {
      this.setState({animation: false});
    });
  }

  render() {
    const {value, onPress} = this.props;
    const buttonScale = this.showValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1],
    });

    const animateWrong = this.animateWrongWord.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['rgb(255,255,255)', 'rgb(255,120,120)', 'rgb(255,255,255)'],
    });

    return (
      <Animated.View
        style={[
          {
            opacity: this.showValue,
            transform: [{scale: buttonScale}],
          },
        ]}>
        <TouchableOpacity
          style={styles.symbolBtnContainer}
          activeOpacity={1}
          onPress={this.state.animation ? null : onPress}>
          <Animated.View
            style={[styles.symbolBtn, {backgroundColor: animateWrong}]}
            poitnerEvents="none">
            <Text style={styles.symbolBtnText}>{value.name}</Text>
          </Animated.View>
          {value.count > 1 ? (
            <View style={styles.symbolBtnCount}>
              <Text style={styles.symbolBtnCountText}>{value.count}</Text>
            </View>
          ) : null}
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
    paddingHorizontal: 20,
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
    borderWidth: 5,
  },
  wordImage: {
    width: 50,
    height: 50,
    top: 0,
    position: 'absolute',
  },
  wordKazNull: {
    fontFamily: MainStyle.font,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
    width: 105,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 50,
  },
  symbolBtnContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgb(255, 255, 255)',
    //marginHorizontal: 6,
    position: 'absolute',
  },
  symbolBtnText: {
    fontFamily: MainStyle.font,
    fontSize: 26,
    color: MainStyle.AppColorGreen,
    textAlign: 'center',
    fontWeight: 'bold',
    top: -2,
  },
  symbolBtnCount: {
    width: 20,
    height: 20,
    backgroundColor: MainStyle.AppColorGreen,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  symbolBtnCountText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
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
  cash: {
    fontSize: 52,
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default TaskCreateWordsScreen;
