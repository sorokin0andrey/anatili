'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainStyle from '../styles/MainStyle';
import {GiftedChat, Send, Bubble} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/ru';

const RightBtnBack = func => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={MainStyle.headerBtn}
    onPress={() => func()}>
    <AwesomeIcon name="whatsapp" size={30} color={MainStyle.HeaderTintColor} />
  </TouchableOpacity>
);

class ChatScreen extends Component {
  _isMounted = false;

  static navigationOptions = ({navigation, screenProps}) => ({
    headerRight: RightBtnBack(() => {
      Linking.openURL('whatsapp://send?phone=+77477771619&text=Здравствуйте!');
    }),
  });

  constructor(props) {
    super(props);
    this.state = {
      progress: true,
      messages: [],
      userKeysMessage: [],
    };

    this.user_id = this.props.screenProps.user.id_user;
    this.manager_id = 0;

    if (this.user_id < this.manager_id) {
      this.chatid = this.user_id + '-' + this.manager_id;
    } else {
      this.chatid = this.manager_id + '-' + this.user_id;
    }

    this.usersRef = this._getRef().child(
      'users/' + this.user_id + '/pushToken',
    );
    this.usersRef.set(this.props.screenProps.push_token);
    this.chatRef = this._getRef().child('messages/' + this.chatid);
    this.chatRefOrder = this.chatRef.orderByChild('order').ref;
    //console.log(this.chatRef)
  }

  componentDidMount() {
    this._isMounted = true;
    this._getMessages(this.chatRefOrder);

    //firebase.database().
    // firebase.auth()
    //   .signInAnonymously()
    //   .then(credential => {
    //     if (credential) {
    //       console.log('default app user ->', credential.user.toJSON());
    //     }
    //   });
  }

  _startMessage(chatRef) {
    var now = new Date().getTime();
    console.log('chatRef', chatRef);
    chatRef.push({
      chatid: this.chatid,
      message: 'Здравствуйте, чем я могу Вам помочь?',
      sender_id: this.manager_id,
      timestamp: database.ServerValue.TIMESTAMP,
      order: -1 * now,
      view: this.user_id + '-1',
    });
  }

  _getRef() {
    return database().ref();
  }

  _getMessages(chatRef) {
    //console.log(chatRef)
    chatRef.on('value', snap => {
      //console.log(snap)
      // get children as an array
      var items = [];
      var userKeysMessage = [];
      snap.forEach(child => {
        if (child.val().sender_id === 0) {
          userKeysMessage.push(child.key);
        }
        items.push({
          _id: child.key,
          text: child.val().message,
          createdAt: new Date(child.val().timestamp),
          user: {
            _id: child.val().sender_id,
          },
        });
      });

      if (items.length === 0) {
        this._startMessage(chatRef);
      }

      if (this._isMounted) {
        this.setState({
          progress: false,
          messages: items,
          userKeysMessage: userKeysMessage,
        });
        this.state.userKeysMessage.forEach(val => {
          this.chatRef.child(val).update({view: this.user_id + '-1'});
        });
      }
    });
  }

  componentWillMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })
  }

  // onSend(messages = []) {
  //     this.setState(previousState => ({
  //       messages: GiftedChat.append(previousState.messages, messages),
  //     }))
  // }

  onSend(messages = []) {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    //messages.forEach(message => {
    let last = messages.length - 1;
    var now = new Date().getTime();
    this.chatRef.push({
      chatid: this.chatid,
      message: messages[last].text,
      sender_id: messages[last].user._id,
      timestamp: database.ServerValue.TIMESTAMP,
      order: -1 * now,
      view: '0-0',
    });
    //});
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <GiftedChat
          placeholder="Задайте вопрос..."
          locale="ru"
          renderAvatar={null}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.user_id,
            //name: 'Вы'
          }}
          renderBubble={props => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {backgroundColor: MainStyle.AppColorGreen},
                left: {backgroundColor: 'white'},
              }}
            />
          )}
          renderSend={props => (
            <Send {...props} containerStyle={styles.sendContainerStyle}>
              <Icon name="send" style={styles.sendIcon} />
            </Send>
          )}
        />
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    this.state.userKeysMessage.forEach(val => {
      this.chatRef.child(val).update({view: this.user_id + '-1'});
    });

    //this.usersRef.off()
    //this.chatRef.off();
    this._isMounted = false;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: MainStyle.BGColor2,
    flex: 1,
  },
  sendIcon: {
    color: 'white',
    fontSize: 14,
  },
  sendContainerStyle: {
    backgroundColor: MainStyle.AppColorGreen2,
    height: 32,
    width: 32,
    right: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    top: -5,
  },
});

export default ChatScreen;
