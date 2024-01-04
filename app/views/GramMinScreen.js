'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Config from '../config/config';
import Api from '../config/api';
import MainStyle from '../styles/MainStyle';
import NoConnection from '../components/NoConnection';
import Preloader from '../components/Preloader';
import HTML from 'react-native-render-html';
import AppButton from '../components/AppButton';

const data = [
  {id: 1, rus: 'Әке', kaz: 'отец'},
  {id: 1, rus: 'Шеше, ана', kaz: 'мама'},
  {id: 1, rus: 'Әже, апа', kaz: 'бабушка'},
];

class GramMinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      progress: true,
      noConnection: false,
    };
  }

  componentDidMount() {
    this.setState({
      content: this.props.data,
      progress: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      content: nextProps.data,
      progress: false,
    });
  }

  render() {
    const {content, progress} = this.state;
    return (
      <View style={styles.main}>
        <View style={MainStyle.titleBlock}>
          <Text style={MainStyle.titleBlockText}>Грамматический минимум</Text>
        </View>

        {progress ? (
          <Preloader />
        ) : (
          <ScrollView style={styles.content}>
            <HTML
              source={{html: content}}
              contentWidth={MainStyle._width}
              //containerStyle={{ color: MainStyle.FontColor}}
              tagsStyles={{
                p: {color: MainStyle.FontColor},
              }}
            />
            <View style={{height: 100}} />
          </ScrollView>
        )}

        <View style={styles.bottom}>
          <AppButton
            style={{borderColor: 'white', borderWidth: 2}}
            value="Выполнить задания"
            onPress={() => this.props.onChangeTab(2)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    //backgroundColor: MainStyle.BGColor
  },
  content: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 25,
  },
  bottom: {
    //justifyContent: 'center',
    width: MainStyle._width,
    alignItems: 'center',
    height: 70,
    position: 'absolute',
    bottom: 0,
  },
});

export default GramMinScreen;
