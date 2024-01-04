'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  Easing,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  InteractionManager,
  SafeAreaView,
} from 'react-native';
import Functions from '../config/functions';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';

const dictant =
  'Лэрри кездесуге өзінің әкесінің жейдесін кимекші болады. Бірақ, әкесі оған киюге рұқсат бермеді. Лэрри бұл жейдені кигенде тұрған ештеңе жоқ деп санады. Ол оны бір рет қана киеді. Ол өзінің қызына жақсы әсер қалдырғысы келді. Онымен кездесуде болған қыз - Джулия. Джулия Лэрриге оның киінгені оған ұнайды деп айтты. Ол бұны естіп, өте қуанышты болды. Оған оның әкесінің не деп айтатыны бәрі бір болды. Ең бастысы, оған маңызды болғаны оның Джулияға ұнағаны. Лэрри бургер жеді. Оның жейдесіне бургердің тұздығы тамып кетті. Ол оны байқамады, себебі ол Джулидің жүзіне қарап отырды. "Лэрри, сен жейдеңді былғадың", – деп күлді ол. Лэрри даққа қарады. Ол оның әкесімен жағымсыз жағдай туатынын білді. Дегенмен бұл қорқынышты емес, себебі Джулиге күлкілі болды.';
let busyAnimWord = false;
const countLifes = [null, null, null];

class TaskAudio2Screen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: (
      <TouchableOpacity
        activeOpacity={0.8}
        style={MainStyle.headerBtn}
        onPress={() => navigation.goBack()}>
        <Icon name="close" size={32} color={MainStyle.HeaderTintColor} />
      </TouchableOpacity>
    ),
    headerLeft: (
      <View style={styles.lifes}>
        {countLifes.map(function (val, index) {
          if (navigation.state.params.lifes > index) {
            return (
              <Icon
                key={'heart_' + index}
                name="heart"
                style={styles.iconHeart}
              />
            );
          } else {
            return (
              <Icon
                key={'heart_' + index}
                name="heart-outline"
                style={styles.iconHeart}
              />
            );
          }
        })}
        <Text style={styles.lifesText}>попытки</Text>
      </View>
    ),
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);

    this.fadeWordAnim = new Animated.Value(0);
    this.inputWordRef = [];
    this.inputWordBtnRef = [];
    this.scrollTextComponent = {};

    this.state = {
      lifes: 3,
      lastWords: 0,
      modalVisible: false,
      showTranslate: false,

      audio: this.props.navigation.state.params.audio,
      dictant: this.props.navigation.state.params.audio.text, //dictant,
      game_id: this.props.navigation.state.params.audio.game_id,
      randomStartSpace: Math.floor(Math.random() * 7),
      interval: 7,
      words: [],
      dictantResult: [],
      currentActiveWord: 0,
      wordsAnswer: [],
      wordsCorrect: [],

      taskDone: false,

      refreshing: false,
      progress: true,
      noConnection: false,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      lifes: this.state.lifes,
    });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.convertText(this.props.navigation.state.params.audio.text);
      }, 200);
    });
  }

  shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  convertText(text) {
    text = text.replace(/(\r\n|\n|\r)/gm, ' ');
    let {randomStartSpace, interval, currentActiveWord, wordsAnswer} =
      this.state;
    //let textCopy = text.replace(/[.,\/#!$%\^&\*;:{}=_`~()"']/g, " ");
    console.log('text: ', text);
    let textCopy = text
      .replace(/[^-a-zA-Zа-яА-ЯёЁәӘіІңҢғҒүҮұҰқҚөӨһáÁǵǴıńŃóÓúÚýÝ'0-9]/g, ' ')
      .replace(/(^\s*)|(\s*)$/g, '');
    console.log('textcopy: ', textCopy);
    let count_space = 0;
    let arrWords = [];
    let nullWord = '';
    let j = 0;
    let intervalCount = randomStartSpace;
    let textResult = text.split('');
    for (let i = 0; i < textCopy.length; i++) {
      if (textCopy[i] === ' ') {
        if (randomStartSpace === count_space || intervalCount === count_space) {
          if (textCopy[i + 1] !== ' ' && textCopy[i + 1] !== '-') {
            j = i + 1;
            nullWord = '';

            while (textCopy[j] !== ' ') {
              textResult[j] = '@';
              nullWord += textCopy[j];
              j++;
              //console.log(j);
              if (j >= textCopy.length) {
                break;
              }
            }

            let inArrWords = false;
            arrWords.map(function (val, index) {
              if (val.word.toLowerCase() === nullWord.toLowerCase()) {
                inArrWords = true;
              }
            });

            let lenWord = nullWord.length;
            if (lenWord > 1 && !inArrWords) {
              arrWords.push({
                word: nullWord,
                index: i + 1,
                lenWord: lenWord,
                active: 1,
              });
            }
            if (inArrWords || lenWord <= 1) {
              for (let y = i + 1; y < i + 1 + lenWord; y++) {
                textResult[y] = text[y];
              }
            }
            intervalCount += interval + Math.floor(Math.random() * 4);
          } else {
            intervalCount++;
          }
        }
        count_space++;
      }
    }

    let dictantText = textResult.join('') + ' ';
    let dictantResult = [];
    let startIndex = 0;
    let countInputWord = 0;
    let p = 0;
    let sWord = '';
    let wordNotWraped = false;
    while (p < dictantText.length) {
      if (dictantText[p] === '@') {
        if (wordNotWraped && sWord.length > 0) {
          // dictantResult.push(
          //     <Text style={styles.textPart} key={"word_w_" + p}>{sWord}</Text>
          // );
          dictantResult.push({sWord: sWord, type: 1});
          sWord = '';
          wordNotWraped = false;
        }
        // dictantResult.push(
        //     <TouchableOpacity
        //         activeOpacity={.9}
        //         style={[styles.textInputPartBtn, {borderColor: (currentActiveWord === countInputWord) ? "#FFEB3B" : "rgba(0,0,0,.2)"}]}>
        //         <Text style={styles.textInputPart} key={"word_w_" + (p + 1)}>{wordsAnswer[countInputWord]}</Text>
        //     </TouchableOpacity>
        // );
        wordsAnswer.push(null);
        dictantResult.push({
          count: countInputWord,
          value: wordsAnswer[countInputWord],
          type: 2,
        });
        //startIndex = p + arrWords[countInputWord].lenWord;
        p += arrWords[countInputWord].lenWord - 1;
        countInputWord++;
      } else {
        sWord += dictantText[p];
        if (dictantText[p] === ' ') {
          // dictantResult.push(
          //     <Text style={styles.textPart} key={"word_w_" + p}>{sWord}</Text>
          // );
          dictantResult.push({sWord: sWord, type: 1});
          sWord = '';
          wordNotWraped = false;
        } else {
          wordNotWraped = true;
        }
      }
      p++;
    }

    console.log(dictantResult, dictantText);

    this.setState({
      dictantResult: dictantResult,
      dictant: dictantText,
      words: this.shuffle(JSON.parse(JSON.stringify(arrWords))),
      wordsCorrect: arrWords,
      wordsAnswer: wordsAnswer,
      progress: false,
    });
    //alert(wordsAnswer);
  }

  onChooseWord(obj, index) {
    if (!busyAnimWord) {
      busyAnimWord = true;

      const {wordsAnswer} = this.state;
      let words = JSON.parse(JSON.stringify(this.state.words));
      let {currentActiveWord} = this.state;
      wordsAnswer[currentActiveWord] = obj;
      let currentW = currentActiveWord;

      let activeWords = false;
      words[index].active = 0;

      words.map(function (val) {
        if (val.active === 1) {
          activeWords = true;
        }
      });

      if (activeWords) {
        let indexNext = currentActiveWord + 1;
        if (indexNext >= wordsAnswer.length) {
          indexNext = 0;
        }
        while (indexNext < wordsAnswer.length) {
          //console.log(indexNext);
          if (wordsAnswer[indexNext] === null) {
            currentActiveWord = indexNext;
            break;
          }
          indexNext++;
          if (indexNext >= wordsAnswer.length) {
            indexNext = 0;
          }
        }
      }

      this.setState({
        wordsAnswer: wordsAnswer,
        taskDone: activeWords ? false : true,
      });
      Animated.parallel([
        this.inputWordBtnRef[index].fadeWord('fadeOut'),
        this.inputWordRef[currentW].fadeWord('fadeIn'),
      ]).start(() => {
        this.setState({
          currentActiveWord: currentActiveWord,
          words: words,
        });

        busyAnimWord = false;
      });

      console.log(wordsAnswer);
    }
  }

  onChangeCurrentInput(obj) {
    const {wordsAnswer, words} = this.state;
    let indexBtn = -1;
    //alert(index);
    if (wordsAnswer[obj.count] !== null) {
      //alert(wordsAnswer[obj.count]);
      //words.unshift(wordsAnswer[obj.count]);
      for (let i = 0; i < words.length; i++) {
        if (words[i].index === wordsAnswer[obj.count].index) {
          words[i].active = 1;
          indexBtn = i;
          break;
        }
      }
      wordsAnswer[obj.count] = null;

      let activeWords = false;
      words.map(function (val) {
        if (val.active === 1) {
          activeWords = true;
        }
      });

      this.setState({
        words: words,
        taskDone: activeWords ? false : true,
      });
      Animated.parallel([
        //alert(indexBtn);
        this.inputWordRef[obj.count].fadeWord('fadeOut').start(),
        this.inputWordBtnRef[indexBtn].fadeWord('fadeIn').start(),
      ]).start(() => {
        this.setState({
          //wordsAnswer: wordsAnswer
        });
      });

      //this.scrollTextComponent.scrollTo();
    }
    this.setState({
      currentActiveWord: obj.count,
    });
  }

  render() {
    const {navigate, state} = this.props.navigation;
    const {
      words,
      audio,
      dictant,
      progress,
      dictantResult,
      currentActiveWord,
      wordsAnswer,
      taskDone,
      modalVisible,
      lastWords,
      lifes,
      showTranslate,
    } = this.state;

    return (
      <LinearGradient
        colors={state.params.gradient}
        style={styles.main}
        start={{x: 0.5, y: 0.0}}
        end={{x: 0.5, y: 1.0}}>
        {progress ? (
          <Preloader color="white" />
        ) : (
          <SafeAreaView style={{flex: 1}}>
            <View
              style={{
                height: MainStyle.headerHeight + MainStyle.statusBarHeight,
              }}
            />
            <ScrollView
              style={styles.container}
              ref={v => {
                this.scrollTextComponent = v;
              }}>
              <View style={{height: 20}} />
              <View style={styles.dictantBlock}>
                {dictantResult.map(function (val, index) {
                  if (val.type === 2) {
                    let preWord = dictantResult[index - 1].sWord;
                    let dot = false;
                    if (preWord[preWord.length - 2] === '.') {
                      dot = true;
                    }
                    return (
                      <WordInputComponent
                        onRef={ref => (this.inputWordRef[val.count] = ref)}
                        key={'audioword_w_' + index}
                        onPress={() => this.onChangeCurrentInput(val)}
                        val={val}
                        dot={dot}
                        currentActiveWord={currentActiveWord}
                        wordsAnswer={wordsAnswer}
                      />
                    );
                  } else {
                    return (
                      <Text style={styles.textPart} key={'word_w_' + index}>
                        {val.sWord}
                      </Text>
                    );
                  }
                }, this)}
              </View>
              {/*<Text style={styles.text}>{this.props.navigation.state.params.audio.text}</Text>*/}
              <View style={{height: 50}} />
            </ScrollView>

            <View style={styles.words}>
              {taskDone ? (
                <AppButton
                  style={styles.btnCheck}
                  value="Проверить"
                  onPress={() => this.checkTask()}
                />
              ) : null}
              <ScrollView style={styles.wordsScroll}>
                <View style={{height: 15}} />
                <View style={styles.wordsScrollContainer}>
                  {words.map(function (val, index) {
                    return (
                      <WordBtnComponent
                        style={val.active === 0 ? {width: 0, height: 0} : null}
                        onRef={ref => (this.inputWordBtnRef[index] = ref)}
                        key={'audioword_' + index}
                        val={val}
                        index={index}
                        onPress={() =>
                          val.active === 0
                            ? null
                            : this.onChooseWord(val, index)
                        }
                      />
                    );
                  }, this)}
                </View>
                <View style={{height: 15}} />
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={() => null}
          visible={modalVisible}>
          {showTranslate ? (
            <View style={styles.modalBox}>
              <View style={{height: 30}} />
              <Text style={styles.titleModal}>Перевод истории</Text>
              <View style={{height: 25}} />
              <ScrollView style={{}}>
                <Text style={styles.textTranslate}>{audio.translate}</Text>
                <Text style={styles.textTranslateAuthor}>{audio.author}</Text>
                <View style={{height: 25}} />
              </ScrollView>
              <AppButton
                style={styles.btnResultContinue}
                value="Закрыть перевод"
                onPress={() => this.showTranslate(false)}
              />
              <View style={{height: 15}} />
              <AppButton
                style={styles.btnResultContinue}
                value="Завершить задание"
                onPress={() => this.endTask()}
              />
            </View>
          ) : lastWords === 0 ? (
            <View style={styles.modalBox}>
              {state.params.audio.isCompleted ? (
                <View style={styles.modalBoxContent}>
                  <Icon
                    name="checkmark-circle-outline"
                    style={[styles.errorIconResult, {color: 'green'}]}
                  />
                  <View style={{height: 30}} />
                  <Text style={styles.textResult}>Отлично!</Text>
                  <Text style={styles.textResult}>Задание пройдено.</Text>
                </View>
              ) : (
                <View style={styles.modalBoxContent}>
                  <Icon
                    name="checkmark-circle-outline"
                    style={[styles.errorIconResult, {color: 'green'}]}
                  />
                  <View style={{height: 30}} />
                  <Text style={styles.textResult}>Отлично!</Text>
                  <Text style={styles.textResult}>
                    Задание пройдено, ты заработал(а)
                  </Text>
                  <View style={{height: 20}} />
                  <Text style={styles.cash}>{audio.multiplier}</Text>
                  <Text style={styles.textResultSub}>
                    {Functions.sklonenie(
                      audio.multiplier,
                      'балл',
                      'балла',
                      'баллов',
                    )}
                  </Text>
                </View>
              )}
              <AppButton
                style={styles.btnResultContinue}
                value="Смотреть перевод"
                onPress={() => this.showTranslate(true)}
              />
              <View style={{height: 15}} />
              <AppButton
                style={styles.btnResultContinue}
                value="Завершить задание"
                onPress={() => this.endTask()}
              />
            </View>
          ) : lifes === 0 ? (
            <View style={styles.modalBox}>
              <View style={styles.modalBoxContent}>
                <Icon name="sad-outline" style={styles.errorIconResult} />
                <View style={{height: 30}} />
                <Text style={styles.textResult}>Слишком много ошибок!</Text>
                <Text style={styles.textResult}>
                  Но за старание ты заработал(а)
                </Text>
                <View style={{height: 20}} />
                <Text style={styles.cash}>{audio.minValue}</Text>
                <Text style={styles.textResultSub}>
                  {Functions.sklonenie(
                    audio.minValue,
                    'балл',
                    'балла',
                    'баллов',
                  )}
                </Text>
              </View>
              <AppButton
                style={styles.btnResultContinue}
                value="Еще раз"
                onPress={() => this.repeatTask()}
              />
              <View style={{height: 15}} />
              <AppButton
                style={styles.btnResultContinue}
                value="Завершить задание"
                onPress={() => this.endTask()}
              />
            </View>
          ) : (
            <View style={styles.modalBox}>
              <View style={styles.modalBoxContent}>
                <Icon
                  name="close-circle-outline"
                  style={styles.errorIconResult}
                />
                <View style={{height: 30}} />
                <Text style={styles.textResult}>
                  Осталось расставить {lastWords}{' '}
                  {Functions.sklonenie(lastWords, 'слово', 'слова', 'слов')}
                </Text>
                <View style={{height: 5}} />
                <Text style={styles.textResultSub}>
                  осталось {lifes}{' '}
                  {Functions.sklonenie(lifes, 'попытка', 'попытки', 'попыток')}
                </Text>
              </View>
              <AppButton
                style={styles.btnResultContinue}
                value="Продолжить"
                onPress={() => this.continueTask()}
              />
              <View style={{height: 15}} />
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

  showTranslate(active) {
    this.setState({
      showTranslate: active,
    });
  }

  endTask() {
    this.setState({
      taskDone: false,
      modalVisible: false,
    });
    this.props.navigation.goBack(null);
    this.props.navigation.goBack(null);
    this.props.navigation.goBack(null);
  }

  repeatTask() {
    this.setState({
      taskDone: false,
      modalVisible: false,
    });
    this.props.navigation.goBack(null);
  }

  continueTask() {
    this.setState({
      taskDone: false,
      modalVisible: false,
    });
  }

  checkTask() {
    //alert('click');
    let {words, wordsAnswer, wordsCorrect, lifes, currentActiveWord, game_id} =
      this.state;
    const {user, audio} = this.props.navigation.state.params;
    let lastWords = 0;
    let currentActive = currentActiveWord;
    let indexBtn = 0;

    let logWordsIndex = [],
      logAnswers = [],
      logCorrectAnswers = [];

    console.log(wordsAnswer, wordsCorrect);

    for (let j = 0; j < wordsAnswer.length; j++) {
      logWordsIndex.push(wordsAnswer[j].index);
      logAnswers.push(wordsAnswer[j].word);
      logCorrectAnswers.push(wordsCorrect[j].index);

      if (wordsAnswer[j].index !== wordsCorrect[j].index) {
        lastWords++;
        for (let i = 0; i < words.length; i++) {
          if (words[i].index === wordsAnswer[j].index) {
            words[i].active = 1;
            indexBtn = i;
            break;
          }
        }
        wordsAnswer[j] = null;
        currentActive = j;
        Animated.parallel([
          //alert(indexBtn);
          this.inputWordRef[j].fadeWord('fadeOut').start(),
          this.inputWordBtnRef[indexBtn].fadeWord('fadeIn').start(),
        ]);
      }
    }

    let formLog = new FormData();
    formLog.append('user_id', user.id_user);
    formLog.append('user_token', user.token);
    formLog.append('game_id', game_id);
    formLog.append('success', lastWords === 0 && !audio.isCompleted ? 1 : 0);
    formLog.append(
      'data',
      JSON.stringify({
        words: logWordsIndex,
        answers: logAnswers,
        correct: logCorrectAnswers,
      }),
    );
    console.log(formLog);
    Api.fetchData(
      Config.DOMAIN + '?action=audioCompletedLog',
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

    if (lastWords === 0 && !audio.isCompleted) {
      let formData = new FormData();
      formData.append('user_id', user.id_user);
      formData.append('user_token', user.token);
      formData.append('cash', audio.multiplier);
      formData.append(
        'task_id',
        JSON.stringify([this.props.navigation.state.params.task_id]),
      );
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
    }

    if (lifes === 1 && lastWords !== 0) {
      let formData = new FormData();
      formData.append('user_id', user.id_user);
      formData.append('user_token', user.token);
      formData.append('points', audio.minValue);
      Api.fetchData(
        Config.DOMAIN + '?action=addRating',
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
    }

    this.props.navigation.setParams({
      lifes: lastWords > 0 ? lifes - 1 : lifes,
    });

    this.setState({
      lifes: lastWords > 0 ? lifes - 1 : lifes,
      words: words,
      wordsAnswer: wordsAnswer,
      modalVisible: true,
      lastWords: lastWords,
      currentActiveWord: currentActive,
    });
  }
}

class WordInputComponent extends Component {
  constructor(props) {
    super(props);
    this.fadeWordAnim = new Animated.Value(0);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  fadeWord(fadeType, callback) {
    this.fadeWordAnim.setValue(fadeType === 'fadeIn' ? 0 : 1);
    return Animated.timing(this.fadeWordAnim, {
      useNativeDriver: true,
      toValue: fadeType === 'fadeIn' ? 1 : 0,
      duration: 200,
      easing: Easing.easeOut,
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const {val, currentActiveWord, wordsAnswer, onPress, dot} = this.props;
    let fadeWordY = this.fadeWordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });
    return (
      <TouchableOpacity
        onPress={() => onPress()}
        activeOpacity={0.9}
        style={[
          styles.textInputPartBtn,
          {
            borderColor:
              currentActiveWord === val.count
                ? '#FFEB3B'
                : Platform.OS === 'ios'
                ? 'transparent'
                : 'rgba(0,0,0,.2)',
          },
        ]}>
        <Animated.Text
          style={[
            styles.textInputPart,
            {opacity: this.fadeWordAnim, transform: [{translateY: fadeWordY}]},
          ]}>
          {wordsAnswer[val.count] !== null
            ? dot
              ? this.capitalizeFirstLetter(wordsAnswer[val.count].word)
              : wordsAnswer[val.count].word.toLowerCase()
            : null}
        </Animated.Text>
      </TouchableOpacity>
    );
  }
}
class WordBtnComponent extends Component {
  constructor(props) {
    super(props);
    this.fadeWordAnim = new Animated.Value(1);
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  fadeWord(fadeType, callback) {
    this.fadeWordAnim.setValue(fadeType === 'fadeIn' ? 0 : 1);
    return Animated.timing(this.fadeWordAnim, {
      useNativeDriver: true,
      toValue: fadeType === 'fadeIn' ? 1 : 0,
      duration: 200,
      easing: Easing.easeOut,
    });
  }

  render() {
    const {val, onPress, style} = this.props;
    let fadeWordY = this.fadeWordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-20, 0],
    });
    return (
      <Animated.View
        style={[
          {opacity: this.fadeWordAnim, transform: [{translateY: fadeWordY}]},
          style,
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.wordItem}
          onPress={() => onPress()}>
          <Text style={styles.wordItemText}>{val.word.toLowerCase()}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  lifesText: {
    fontFamily: MainStyle.font,
    fontSize: 10,
    color: 'rgba(255,255,255,.6)',
    position: 'absolute',
    top: 3,
    left: 15,
  },
  lifes: {
    flexDirection: 'row',
    padding: 15,
  },
  iconHeart: {
    color: 'white',
    fontSize: 22,
    marginHorizontal: 1,
  },

  main: {
    flex: 1,
  },
  text: {
    fontFamily: MainStyle.font,
    fontSize: 18,
    lineHeight: 24,
    color: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    //paddingVertical: 50,
  },
  wordsScroll: {
    //flexDirection: 'column',
  },
  words: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  wordsScrollContainer: {
    //alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  wordItem: {
    paddingHorizontal: 10,
    height: 32,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  wordItemText: {
    fontFamily: MainStyle.font,
    fontSize: 14,
    color: 'white',
    top: Platform.OS === 'ios' ? 0 : -2,
  },
  headerBtn: {
    padding: 15,
  },
  dictantBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  textPart: {
    fontFamily: MainStyle.font,
    fontSize: 18,
    color: 'white',
    height: 32,
    lineHeight: 32,
    //backgroundColor: 'green'
  },
  textInputPartBtn: {
    backgroundColor: 'rgba(0,0,0,.2)',
    borderRadius: 5,
    minWidth: 70,
    height: 28,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textInputPart: {
    fontFamily: MainStyle.font,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    top: Platform.OS === 'ios' ? -2 : -2,
  },
  btnCheck: {
    //position: 'absolute',
    //alignSelf: 'center',
    top: 30,
    marginHorizontal: 30,
    zIndex: 100,
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
  textTranslate: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: MainStyle.font,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'justify',
  },
  textTranslateAuthor: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: MainStyle.font,
    color: 'rgba(255,255,255,.6)',
    textAlign: 'right',
  },
});

export default TaskAudio2Screen;
