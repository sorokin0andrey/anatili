'use strict';

import React, {Component} from 'react';
import {View, StyleSheet, Modal, Text, TouchableOpacity} from 'react-native';
import MainStyle from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';

class NoConnection extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {onPressRetry} = this.props;
    return (
      <Modal animationType="fade" transparent={true}>
        <View style={styles.main}>
          <Text style={styles.text1}>Нет подключения к Интернету.</Text>
          <Text style={styles.text2}>
            Проверьте интернет соединение и повторите попытку.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onPressRetry}>
            <Icon
              name="refresh"
              size={36}
              color="white"
              style={styles.iconRetry}
            />
            <Text style={styles.retryBtnText}>Попробывать снова</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    width: MainStyle._width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
    padding: 30,
  },
  text1: {
    fontFamily: MainStyle.font,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  text2: {
    marginTop: 5,
    fontFamily: MainStyle.font,
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  retryBtn: {
    width: MainStyle._width - 60,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20,
    borderColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
  },
  retryBtnText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontFamily: MainStyle.font,
    backgroundColor: 'transparent',
    top: -1,
  },
  iconRetry: {
    top: 2,
    marginRight: 12,
  },
});

module.exports = NoConnection;
