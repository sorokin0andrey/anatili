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
  ScrollView,
  ImageBackground,
  SectionList,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import HTML from 'react-native-render-html';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/Ionicons';

const data = [
  {
    id: 1,
    rus: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб дизайне Lorem Ipsum является стандартной',
    kaz: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб дизайне Lorem Ipsum является стандартной',
    autor: 'Автор',
  },
  {id: 1, rus: 'Шеше, ана', kaz: 'мама', text: 'uyfkuyfkuy kykuy kuykyfy'},
  {id: 1, rus: 'Әже, апа', kaz: 'бабушка', text: 'uyfkuyfkuy kykuy kuykyfy'},
];

class MaterialItemScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.state.params.title,
  });

  constructor(props) {
    super(props);
    this.toggle = [];
    this.state = {
      items: [],

      isCollapsedItems: [],
      progress: true,
      refreshing: false,
      noConnection: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const {navigate, goBack} = this.props.navigation;
    this.setState({refreshing: true});
    const {user, actionMethod} = this.props.navigation.state.params;
    let formData = new FormData();
    formData.append('user_id', user.id_user);
    formData.append('user_token', user.token);
    formData.append('is_payment', user.is_payment);
    Api.fetchData(
      Config.DOMAIN + '?action=' + actionMethod,
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
          Alert.alert('Ошибка!', result.error[0], [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
              style: 'cancel',
            },
          ]);
          goBack(null);
        } else {
          let isCollapsed = [];
          result.map(function (val) {
            isCollapsed.push(true);
          });
          this.setState({
            isCollapsedItems: isCollapsed,
            items: result,
          });
        }

        this.setState({
          refreshing: false,
          noConnection: false,
          progress: false,
        });
      }
    });
  }

  // _item(item, index){
  //     const { color } = this.props.navigation.state.params;
  //     const { isCollapsedItems } = this.state;
  //     return (
  //         <View style={styles.item}>
  //             <View style={{overflow: 'hidden', borderRadius: 5,}}>
  //             <View style={{padding: 20}}>
  //                 <HTML
  //                     style={styles.textRu}
  //                     tagsStyles={{
  //                         p: { color: MainStyle.AppColorGreen },
  //                     }}
  //                     html={item.acf.title_ru}/>
  //             </View>
  //
  //             {(item.acf.author) ? <Text style={styles.authorText}>{item.acf.author}</Text> : null}
  //
  //             <TouchableHighlight
  //                 activeOpacity={1}
  //                 underlayColor={color}
  //                 style={[styles.btnToggleTranslate, {backgroundColor: color}]}
  //                 onPress={() => this.stateCollapsed(index)}>
  //                 <View style={styles.btnToggleTranslateWrapper}>
  //                     <Text style={styles.btnToggleTranslateText}>Смотреть перевод</Text>
  //                     <Icon name={ isCollapsedItems[index] ? "arrow-down" : "arrow-up"} style={styles.iconArrow}/>
  //                 </View>
  //             </TouchableHighlight>
  //
  //             <Collapsible collapsed={isCollapsedItems[index]} style={{backgroundColor: color}}>
  //                 <View style={{padding: 20}}>
  //                     <HTML
  //                         style={styles.textKz}
  //                         tagsStyles={{
  //                             p: { color: 'white' },
  //                         }}
  //                         html={item.acf.title_kz}/>
  //                 </View>
  //             </Collapsible>
  //             </View>
  //         </View>
  //     );
  // }

  // notAllowed() {
  //     Alert.alert(
  //         'Демо версия',
  //         'Данная возможность доступна только в платной версии',
  //         [
  //             {text: 'Отмена', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //             {text: 'Купить', onPress: () => this.props.navigation.navigate('PaymentScreen')},
  //         ],
  //         { cancelable: true }
  //         );
  // }

  _item(item, index) {
    const {color, id} = this.props.navigation.state.params;
    const {isCollapsedItems} = this.state;
    return (
      <TouchableOpacity
        onPress={() => {}}
        activeOpacity={1}
        style={[styles.item, {opacity: item.access ? 1 : 0.5}]}>
        <View style={{overflow: 'hidden', borderRadius: 5}}>
          <View style={{padding: 20}}>
            <Text style={styles.textRu}>{item.ru_text}</Text>
            {id === 2 ? (
              <Text style={styles.authorText}>{item.author}</Text>
            ) : null}
            {/*<HTML*/}
            {/*style={styles.textRu}*/}
            {/*tagsStyles={{*/}
            {/*p: { color: MainStyle.AppColorGreen },*/}
            {/*}}*/}
            {/*html={item.kz_text}/>*/}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={color}
              style={[styles.btnToggleTranslate, {backgroundColor: color}]}
              //onPress={() => item.access ? this.stateCollapsed(index) : this.notAllowed()}>
              onPress={() => this.stateCollapsed(index)}>
              <View style={styles.btnToggleTranslateWrapper}>
                <Text style={styles.btnToggleTranslateText}>Перевод</Text>
              </View>
            </TouchableHighlight>
            {/*<View style={{height: 36, width: 1, backgroundColor: "white"}}/>*/}
            {id === 3 ? null : (
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={color}
                style={[styles.btnToggleTranslate, {backgroundColor: color}]}
                //onPress={() => item.access ? this.startPractic(item) : this.notAllowed()}>
                onPress={() => this.startPractic(item)}>
                <View style={styles.btnToggleTranslateWrapper}>
                  <Text style={styles.btnToggleTranslateText}>Задание</Text>
                </View>
              </TouchableHighlight>
            )}
          </View>

          <Collapsible
            collapsed={isCollapsedItems[index]}
            style={{backgroundColor: color}}>
            <View style={{padding: 20}}>
              <Text style={styles.textKz}>{item.kz_text}</Text>
            </View>
          </Collapsible>
        </View>
      </TouchableOpacity>
    );
  }

  startPractic(item) {
    const {navigate, state} = this.props.navigation;
    navigate('TaskCreateSentenceScreen', {
      gradient: [state.params.color, state.params.color],
      itemMaterial: item,
    });
  }

  stateCollapsed(index) {
    let {isCollapsedItems} = this.state;
    isCollapsedItems[index] = !isCollapsedItems[index];
    this.setState({
      isCollapsedItems: isCollapsedItems,
    });
  }

  render() {
    const {items, progress, refreshing} = this.state;
    return (
      <View style={styles.main}>
        {progress ? (
          <Preloader />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={MainStyle.FontColor}
                refreshing={refreshing}
                onRefresh={() => this.getData()}
              />
            }
            extraData={this.state}
            ItemSeparatorComponent={highlighted => (
              <View
                style={[styles.separator, highlighted && {marginLeft: 0}]}
              />
            )}
            style={styles.list}
            keyExtractor={(item, index) => 'material_' + item.id + index}
            data={items}
            renderItem={({item, index}) => this._item(item, index)}
            ListFooterComponent={() => <View style={{height: 50}} />}
            ListHeaderComponent={() => <View style={{height: 25}} />}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: MainStyle.BGColor2,
  },
  separator: {
    height: 15,
  },

  item: {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      height: 4,
    },
    //elevation: 8,
    borderRadius: 5,
    marginHorizontal: 25,
    //padding: 20,
    //overflow: 'hidden',
    backgroundColor: 'white',
  },
  textRu: {
    fontFamily: MainStyle.font,
    fontSize: 14,
    color: MainStyle.AppColorGreen,
    lineHeight: 20,
  },
  textKz: {
    fontFamily: MainStyle.font,
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  authorText: {
    fontFamily: MainStyle.font,
    fontSize: 12,
    color: MainStyle.AppColorGreen,
    textAlign: 'right',
    fontStyle: 'italic',
  },

  btnToggleTranslate: {
    flex: 1,
    height: 36,
    //alignItems: 'center',
    justifyContent: 'center',
    //borderBottomLeftRadius: 5,
    //borderBottomRightRadius: 5,
    backgroundColor: 'white',
  },
  btnToggleTranslateWrapper: {
    backgroundColor: 'transparent',
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 25,
  },
  btnToggleTranslateText: {
    color: 'white',
    fontFamily: MainStyle.font,
    fontSize: 14,
    textAlign: 'center',
  },
  iconArrow: {
    color: 'white',
    fontSize: 22,
    position: 'absolute',
    right: 20,
    top: -3,
  },
});

export default MaterialItemScreen;
