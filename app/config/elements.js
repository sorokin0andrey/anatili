import React, {Component} from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  Switch,
  Platform,
} from 'react-native';

import MainStyle from '../styles/MainStyle';
import Icon from 'react-native-vector-icons/Ionicons';

export default {
  _OldBtnLat: (screenProps, _function) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => _function()}>
      <View style={MainStyle.changeLatBtn}>
        <Text style={MainStyle.changeLatBtnText}>
          {screenProps.lang_latin === 1 ? 'на кириллицу' : 'на латиницу'}
        </Text>
      </View>
    </TouchableOpacity>
  ),

  _BtnLogOut: _function => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={MainStyle.headerBtn}
      onPress={() => _function()}>
      <Icon name="log-out" size={28} color={MainStyle.HeaderTintColor} />
    </TouchableOpacity>
  ),

  _BtnLat: (screenProps, _function) => (
    <View style={MainStyle.changeLatBtn}>
      <Text style={MainStyle.changeLatBtnText}>перейти на{'\n'}латиницу</Text>
      {Platform.select({
        ios: (
          <Switch //ios_backgroundColor={MainStyle.AppColorGreen}
            trackColor={{false: 'white', true: MainStyle.AppColorGreen}}
            value={screenProps.lang_latin === 1}
            onValueChange={() => _function()}
          />
        ),
        android: (
          <Switch //trackColor={MainStyle.AppColorGreen}
            trackColor={{
              false: 'rgba(255,255,255,.4)',
              true: MainStyle.AppColorGreen,
            }}
            thumbColor="white"
            value={screenProps.lang_latin === 1}
            onValueChange={() => _function()}
          />
        ),
      })}
    </View>
  ),
};
