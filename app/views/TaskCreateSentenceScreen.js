'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
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
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config/config';
import Api from '../config/api';
import Functions from '../config/functions';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import AppButton from '../components/AppButton';

const dataMain = [
  {
    multiplier: 1,
    sentenceStart: 'В центре сада есть фонтан',
    sentenceEnd: 'Бақтың ортасында бұрқақ бар',
    answers: [
      ['Бақтың', 'Бұрқақ', 'Бақта', 'Бұрқақта', 'Орта', 'Осында'],
      ['ортында', 'осы', 'ортасында', 'орасында', 'ортында', 'осында'],
      ['бақ', 'бұрқақ', 'бар', 'бұрқақта', 'барма', 'бұр'],
      ['осында', 'барма', 'бар', 'ывы', 'ывап', 'цуек'],
    ],
  },
  {
    multiplier: 1,
    sentenceStart: 'Они играли в игры, пока не заснули',
    sentenceEnd: 'Олар ұйықтағанға дейін ойнады',
    answers: [
      ['Бақтың', 'Бұрқақ', 'Бақта', 'Бұрқақта', 'Орта', 'Осында'],
      ['ортында', 'осы', 'ортасында', 'орасында', 'ортында', 'осында'],
      ['бақ', 'бұрқақ', 'бар', 'бұрқақта', 'барма', 'бұр'],
      ['осында', 'барма', 'бар', 'ывы', 'ывап', 'цуек'],
    ],
  },
];
const slideWidth = MainStyle._width;

class TaskCreateSentenceScreen extends Component {
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
    this.state = {
      user: {},

      data: [],
      cash: 0,
      successSen: false,
      currentSenIndex: 0,
      currentSen: [],
      currentWordIndex: 0,
      refreshing: false,
      progress: true,
      noConnection: false,
      modalVisible: false,
      endSenWrong: false,
      currentSenWrongIndex: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getSentences(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getSentences(user) {
    this.setState({refreshing: true});
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    const {itemMaterial, itemGram} = this.props.navigation.state.params;
    if (itemMaterial) {
      formData.append('task_id', itemMaterial.id);
      Api.fetchData(
        Config.DOMAIN + '?action=getMaterialByID',
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
          result.sentenceStart = itemMaterial.ru_text;
          result.sentenceEnd = itemMaterial.kz_text;
          this.setState({
            data: [result],
            noConnection: false,
            refreshing: false,
            progress: false,
          });
          this.animateSlide(0);
        }
      });
    } else {
      if (itemGram) {
        formData.append('category_id', itemGram.id);
        Api.fetchData(
          Config.DOMAIN + '?action=getGrammarLessons',
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
            this.setState({
              data: result,
              noConnection: false,
              refreshing: false,
              progress: false,
            });
            this.animateSlide(0);
          }
        });
      } else {
        formData.append('cat_id', this.props.navigation.state.params.cat_id);
        Api.fetchData(
          Config.DOMAIN + '?action=getAllSentence',
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
              //alert(result.error);
              Alert.alert(null, result.error[0], [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
              this.props.navigation.goBack(null);
            } else {
              this.setState({
                data: result,
                noConnection: false,
                refreshing: false,
                progress: false,
              });
              this.animateSlide(0);
            }
          }
        });
      }
    }
  }

  nextWord(word, wordIndex) {
    let {data, currentSen, currentWordIndex, currentSenIndex, user} =
      this.state;
    let currentSenWrongIndex = [];
    let endSenWrong = false;
    let successSen = false;

    currentSen.push(word);
    if (currentWordIndex + 1 === data[currentSenIndex].answers.length) {
      // let textEnd = data[currentSenIndex].sentenceEnd.replace(/[,\/#!$%\^&\*;:{}=_`~()"']/g, " ").replace(/ {1,}/g," ");
      // textEnd = textEnd.split(' ');
      // for(let j=0; j<currentSen.length; j++){
      //     if(currentSen[j] !== textEnd[j]){
      //         currentSenWrongIndex.push(j);
      //         endSenWrong = true;
      //     }
      // }

      for (let j = 0; j < currentSen.length; j++) {
        if (currentSen[j].correct !== 1) {
          currentSenWrongIndex.push(j);
          endSenWrong = true;
        }
      }

      if (!endSenWrong) {
        successSen = true;
      }

      let sentence = '';
      currentSen.forEach(function (val, index) {
        sentence += val.word + ' ';
      });
      let formLog = new FormData();
      formLog.append('user_id', user.id_user);
      formLog.append('user_token', user.token);
      formLog.append('success', endSenWrong ? 0 : 1);
      formLog.append('data', JSON.stringify({sestenceUser: [sentence]}));
      formLog.append('game_id', data[currentSenIndex].game_id);

      let action = '';
      if (this.props.navigation.state.params.itemMaterial) {
        let item = this.props.navigation.state.params.itemMaterial;
        action = 'materialCompletedLog';
      } else {
        if (this.props.navigation.state.params.itemGram) {
          let item = this.props.navigation.state.params.itemGram;
          action = 'gramarCompletedLog';
        } else {
          action = 'sentenceCompletedLog';
          formLog.append('lesson_id', data[currentSenIndex].id);
        }
      }
      console.log('form: ', formLog);
      Api.fetchData(
        Config.DOMAIN + '?action=' + action,
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
    } else {
      currentWordIndex += 1;
    }

    //alert(currentWordIndex);
    this.setState({
      successSen: successSen,
      currentSenIndex: currentSenIndex,
      currentWordIndex: currentWordIndex,
      currentSen: currentSen,
      endSenWrong: endSenWrong,
      currentSenWrongIndex: currentSenWrongIndex,
    });
  }

  deleteWord() {
    let {currentSen, currentWordIndex} = this.state;

    currentSen.pop();
    currentWordIndex -= 1;

    //alert(currentWordIndex);
    this.setState({
      currentWordIndex: currentWordIndex,
      currentSen: currentSen,
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
      dictant,
      currentSen,
      currentSenIndex,
      currentWordIndex,
      progress,
      modalVisible,
      endSenWrong,
      currentSenWrongIndex,
      successSen,
      cash,
    } = this.state;

    //let words = (!progress && data.length > 0) ? data[currentSenIndex].answers[currentWordIndex] : [];
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
              {successSen ? null : (
                <Text style={styles.sentenceRus}>
                  {data[currentSenIndex].sentenceStart}
                </Text>
              )}

              <View style={{height: 40}} />
              {successSen ? (
                <Icon
                  name="checkmark-circle-outline"
                  style={{fontSize: 60, alignSelf: 'center', color: 'white'}}
                />
              ) : null}
              <View style={styles.sentenceKaz}>
                {currentSen.map(function (val, index) {
                  return (
                    <View key={'sen_word_' + index}>
                      <Text
                        style={[
                          styles.sentenceEndText,
                          Functions.in_array(index, currentSenWrongIndex) !==
                          false
                            ? {
                                textDecorationLine: 'line-through',
                                color: 'rgba(255,255,255,.6)',
                              }
                            : null,
                        ]}>
                        {val.word}
                      </Text>
                    </View>
                  );
                })}
                {currentSen.length === 0 ||
                currentSen.length ===
                  data[currentSenIndex].answers.length ? null : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.deleteWord()}>
                    <Icon name="backspace" style={styles.iconDel} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {!progress && data[currentSenIndex].answers ? (
            endSenWrong ? (
              <View style={styles.endSenBlock}>
                <AppButton
                  style={styles.btnCheck}
                  value="Еще раз"
                  onPress={() => this.repeatSen()}>
                  <Icon
                    name="refresh"
                    style={{
                      color: MainStyle.FontColor,
                      fontSize: 24,
                      marginLeft: 15,
                    }}
                  />
                </AppButton>
              </View>
            ) : successSen ? (
              <View style={styles.endSenBlock}>
                <AppButton
                  style={styles.btnCheck}
                  value={
                    currentSenIndex + 1 !== data.length ? 'Далее' : 'Завершить'
                  }
                  onPress={() => this.nextSen()}
                />
              </View>
            ) : (
              <View style={styles.words}>
                {data[currentSenIndex].answers[currentWordIndex].map(function (
                  val,
                  index,
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.nextWord(val, index)}
                      key={index + 'create_sen'}
                      activeOpacity={0.8}
                      style={styles.wordItem}>
                      <Text style={styles.wordItemText}>{val.word}</Text>
                    </TouchableOpacity>
                  );
                },
                this)}
              </View>
            )
          ) : null}
        </SafeAreaView>

        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => null}
          visible={modalVisible}>
          <View style={styles.modalBox}>
            {data.length > 0 && data[0].isCompleted === 1 ? (
              <View style={styles.modalBoxContent}>
                <Icon
                  name="checkmark-circle-outline"
                  style={[styles.errorIconResult, {color: 'green'}]}
                />
                <View style={{height: 30}} />
                <Text style={styles.textResult}>Отлично!</Text>
                <Text style={styles.textResult}>Задание выполнено</Text>
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
              value="Завершить задание"
              onPress={() => this.endTask()}
            />
          </View>
        </Modal>
      </LinearGradient>
    );
  }

  nextSen() {
    let {data, currentSenIndex, user, endSenWrong, currentSen} = this.state;
    let currentSenIndex_ = currentSenIndex + 1;

    if (currentSenIndex_ === data.length) {
      currentSenIndex_--;
      let cash = 0;
      let answerData = [];
      for (let i = 0; i < data.length; i++) {
        cash += parseInt(data[i].multiplier);
        answerData.push(data[i].id);
      }
      this.setState({
        modalVisible: true,
        cash: cash,
      });

      if (data[0].isCompleted === 0) {
        let formData = new FormData();
        formData.append('user_id', user.id_user);
        formData.append('user_token', user.token);
        formData.append('cash', cash);
        formData.append('task_id', JSON.stringify(answerData));
        Api.fetchData(
          Config.DOMAIN + '?action=taskCompleted',
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
            this.setState({
              noConnection: false,
              refreshing: false,
              progress: false,
            });
          }
        });
      }
    }

    this.setState({
      currentSenIndex: currentSenIndex_,
      currentWordIndex: 0,
      currentSen: [],
      endSenWrong: false,
      currentSenWrongIndex: [],
      successSen: false,
    });
    this.animateSlide(currentSenIndex_);
  }

  repeatSen() {
    this.setState({
      currentWordIndex: 0,
      currentSen: [],
      endSenWrong: false,
      currentSenWrongIndex: [],
      successSen: false,
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

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sentenceRus: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontFamily: MainStyle.font,
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.5)',
    textAlign: 'center',
  },
  sentenceKaz: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentenceEndText: {
    fontFamily: MainStyle.fontMedium,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    fontSize: 22,
    color: 'white',
    lineHeight: 24,
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  iconDel: {
    opacity: 0.6,
    marginLeft: 10,
    fontSize: 26,
    color: 'rgba(255,255,255,.8)',
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //height: 300,
    //width: MainStyle._width,
  },
  wordsRow: {
    flexDirection: 'row',
    marginTop: 2 / PixelRatio.get(),
  },
  wordItem: {
    width: MainStyle._width / 2 - 2 / PixelRatio.get(),
    marginHorizontal: 1 / PixelRatio.get(),
    marginTop: 2 / PixelRatio.get(),
    height: 60,
    backgroundColor: 'rgba(0,0,0,.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordItemText: {
    fontFamily: MainStyle.font,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    //textDecorationLine: 'line-through',
  },
  separatorVerticalWord: {
    height: 70,
    width: 4 / PixelRatio.get(),
  },
  separatorHorizontalWord: {
    height: 2 / PixelRatio.get(),
  },
  endSenBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
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

export default TaskCreateSentenceScreen;
