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
} from 'react-native';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import AppButton from '../components/AppButton';

class UserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: true,
    };
  }

  componentDidMount() {}

  render() {
    const {progress} = this.state;
    return progress ? <Preloader /> : <View style={styles.main} />;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: MainStyle.BGColor,
    flex: 1,
  },
});

export default UserScreen;
