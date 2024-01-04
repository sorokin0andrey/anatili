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
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Functions from '../config/functions';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import AppButton from '../components/AppButton';

const slideWidth = MainStyle._width;

class TaskCheckWordsScreen extends Component {
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
      data: [],
      answer: [],
      answerData: [],
      checkTask: false,
      modalVisible: false,
      cash: 0,

      currentTaskIndex: 0,
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      if (user !== null) {
        let u = JSON.parse(user);
        this.getTasksWords(u);
        this.setState({
          user: u,
        });
      }
    });
  }

  getTasksWords(user) {
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    formData.append('cat_id', this.props.navigation.state.params.cat_id);
    Api.fetchData(
      Config.DOMAIN + '?action=getKWords',
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
        if (result.error || result.length === 0 || result[0].correct === null) {
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

  checkTask() {
    let {data, answer, currentTaskIndex, cash, answerData, user} = this.state;
    data[currentTaskIndex].words.map(function (val, index) {
      if (
        data[currentTaskIndex].correct.indexOf(index) !== -1 &&
        answer[currentTaskIndex].indexOf(index) !== -1
      ) {
        cash++;
        answerData.push(data[currentTaskIndex].id);
      }
    });

    let formLog = new FormData();
    formLog.append('user_id', user.id_user);
    formLog.append('user_token', user.token);
    formLog.append('game_id', data[currentTaskIndex].game_id);
    formLog.append('success', currentTaskIndex + 1 === data.length ? 1 : 0);
    formLog.append('lesson_id', data[currentTaskIndex].id);
    formLog.append('data', JSON.stringify({answers: answer[currentTaskIndex]}));
    console.log('form: ', formLog);
    Api.fetchData(
      Config.DOMAIN + '?action=kwordsCompletedLog',
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

    this.setState({
      checkTask: true,
      cash: cash,
    });
  }

  nextTask() {
    let {answer, data, currentTaskIndex, answerData, user, cash} = this.state;
    let currentTaskIndex_ = currentTaskIndex + 1;
    let modalVisible_ = false;

    if (currentTaskIndex_ === data.length) {
      currentTaskIndex_ = currentTaskIndex;
      modalVisible_ = true;

      let formData = new FormData();
      formData.append('user_id', user.id_user);
      formData.append('user_token', user.token);
      formData.append('is_payment', user.is_payment);
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
      this.animateSlide(currentTaskIndex_);
      //setTimeout(() => {
      for (let i = 0; i < data[currentTaskIndex_].words.length; i++) {
        this.animateWord[i].animate();
      }
      //}, 200);
    }
    this.setState({
      modalVisible: modalVisible_,
      checkTask: false,
      currentTaskIndex: currentTaskIndex_,
    });
  }

  pressWord(val, index) {
    let {answer, currentTaskIndex} = this.state;

    if (answer[currentTaskIndex]) {
      let inArray = answer[currentTaskIndex].indexOf(index);
      if (inArray === -1) {
        answer[currentTaskIndex].push(index);
      } else {
        answer[currentTaskIndex].splice(inArray, 1);
      }
    } else {
      answer[currentTaskIndex] = [];
      answer[currentTaskIndex].push(index);
    }

    this.setState({
      answer: answer,
    });
  }

  itemTranslate(item, index) {
    return (
      <View style={styles.itemTranslateStyle}>
        <Text style={styles.itemTranslateStyleText}>
          <Text style={{color: 'rgba(255,255,255,.6)'}}>{item.word}</Text> -{' '}
          {item.translate}
        </Text>
      </View>
    );
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {
      data,
      currentTaskIndex,
      progress,
      answer,
      checkTask,
      modalVisible,
      cash,
    } = this.state;
    //alert(answer[currentTaskIndex]);

    let checkDone = false;
    if (
      answer[currentTaskIndex] &&
      data[currentTaskIndex].correct.length === answer[currentTaskIndex].length
    ) {
      checkDone = true;
    }
    let lostWords = answer[currentTaskIndex]
      ? answer[currentTaskIndex].length
      : 0;
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

          {progress ? (
            <Preloader color="white" />
          ) : (
            <ScrollView style={styles.container}>
              <View style={{height: 20}} />
              <Text style={styles.title}>{data[currentTaskIndex].title}</Text>
              <Text style={styles.lostWords}>
                {lostWords} из {data[currentTaskIndex].correct.length}
              </Text>
              <View style={{height: 20}} />
              <View style={styles.words}>
                {data[currentTaskIndex].words.map(function (val, index) {
                  let bgColor = null;
                  let active = false;
                  let enable = true;
                  if (
                    answer[currentTaskIndex] &&
                    answer[currentTaskIndex].indexOf(index) !== -1
                  ) {
                    active = true;
                  }
                  if (
                    answer[currentTaskIndex] &&
                    !active &&
                    data[currentTaskIndex].correct.length ===
                      answer[currentTaskIndex].length
                  ) {
                    enable = false;
                  }

                  if (checkDone && checkTask) {
                    if (data[currentTaskIndex].correct.indexOf(index) !== -1) {
                      bgColor = '#8BC34A';
                    }
                    if (
                      data[currentTaskIndex].correct.indexOf(index) === -1 &&
                      answer[currentTaskIndex].indexOf(index) !== -1
                    ) {
                      bgColor = '#FF5722';
                    }
                  }
                  return (
                    <WordComponent
                      key={'word_check_' + index}
                      value={val}
                      index={index}
                      onPress={() => this.pressWord(val, index)}
                      enable={enable}
                      active={active}
                      bgColor={bgColor}
                      onRef={ref => (this.animateWord[index] = ref)}
                    />
                  );
                }, this)}
              </View>
            </ScrollView>
          )}

          {checkTask ? (
            <AppButton
              style={{
                marginBottom: 15,
                marginHorizontal: 30,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 2,
              }}
              fontColor="white"
              underlayColor="transparent"
              value="Посмотреть перевод"
              onPress={() => this.setState({modalVisible: true})}
            />
          ) : null}

          {progress ? null : (
            <AppButton
              style={{
                marginBottom: 30,
                marginHorizontal: 30,
                opacity: checkDone ? 1 : 0.6,
              }}
              value={checkTask ? 'Далее' : 'Проверить'}
              onPress={() =>
                checkTask
                  ? this.nextTask()
                  : checkDone
                  ? this.checkTask()
                  : this.alertError()
              }
            />
          )}
        </SafeAreaView>

        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => null}
          visible={modalVisible}>
          {checkTask ? (
            <View style={styles.modalBox}>
              <View style={{height: 30}} />
              <Text style={styles.titleModal}>Перевод слов</Text>
              <View style={{height: 30}} />
              <FlatList
                style={styles.listTrans}
                ItemSeparatorComponent={highlighted => (
                  <View
                    style={[
                      styles.separatorTranslate,
                      highlighted && {marginLeft: 0},
                    ]}
                  />
                )}
                keyExtractor={(item, index) => 'checkWords_translate_' + index}
                data={data[currentTaskIndex].words}
                renderItem={({item, index}) => this.itemTranslate(item, index)}
                ListFooterComponent={() => <View style={{height: 50}} />}
              />
              <AppButton
                style={styles.btnResultContinue}
                value="Ок, понятно!"
                onPress={() => this.setState({modalVisible: false})}
              />
            </View>
          ) : null}
          {checkTask ? null : (
            <View style={styles.modalBox}>
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
              <AppButton
                style={styles.btnResultContinue}
                value="Завершить задание"
                onPress={() => this.endTask()}
              />
            </View>
          )}
        </Modal>
      </LinearGradient>
    );
  }

  endTask() {
    this.setState({
      modalVisible: false,
    });
    this.props.navigation.goBack(null);
    this.props.navigation.goBack(null);
  }

  alertError() {
    const {data, currentTaskIndex, answer} = this.state;
    let lostWords =
      data[currentTaskIndex].correct.length -
      (answer[currentTaskIndex] ? answer[currentTaskIndex].length : 0);
    Alert.alert(
      'Ой! Еще не все.',
      'Осталось отметить ' +
        lostWords +
        ' ' +
        Functions.sklonenie(lostWords, 'слово', 'слова', 'слов'),
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
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
      delay: index * 100,
      //easing: Easing.easeOut
    }).start();
  }

  render() {
    const {enable, active, value, onPress, bgColor} = this.props;
    const buttonScale = this.showValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
    return (
      <Animated.View
        style={[
          {
            opacity: this.showValue,
            transform: [{scale: buttonScale}],
          },
          enable ? null : {opacity: 0.5},
        ]}>
        <TouchableOpacity
          onPress={() => (enable ? onPress() : {})}
          activeOpacity={1}
          style={[
            styles.wordItem,
            active ? {backgroundColor: 'white'} : null,
            bgColor ? {backgroundColor: bgColor} : null,
          ]}>
          <Text
            style={[
              styles.wordItemText,
              active ? {color: MainStyle.AppColorGreen} : null,
              bgColor ? {color: 'white'} : null,
            ]}>
            {value.word}
          </Text>
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
    lineHeight: 22,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'center',
  },
  lostWords: {
    fontFamily: MainStyle.font,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  words: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  wordItem: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    height: 30,
    paddingHorizontal: 10,
    marginRight: 15,
    marginBottom: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordItemText: {
    fontSize: 16,
    color: 'white',
    fontFamily: MainStyle.font,
    textAlign: 'center',
    top: -1,
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

  titleModal: {
    fontSize: 18,
    fontFamily: MainStyle.font,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listTrans: {
    alignSelf: 'stretch',
  },
  itemTranslateStyle: {
    paddingVertical: 10,
  },
  itemTranslateStyleText: {
    fontSize: 14,
    fontFamily: MainStyle.font,
    color: 'white',
  },

  separatorTranslate: {
    height: MainStyle.separatorHeight,
    backgroundColor: 'rgba(255,255,255,.25)',
  },
});

export default TaskCheckWordsScreen;
