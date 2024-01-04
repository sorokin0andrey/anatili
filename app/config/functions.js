'use strict';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

module.exports = {
  ratingToStars: function (ratingNum, sizeStar) {
    sizeStar = sizeStar ? sizeStar : 18;
    var strStars = [],
      i = 0;
    var full_stars = Math.floor(ratingNum);
    var half_star = Math.ceil(ratingNum - Math.floor(ratingNum));
    var hole_star = Math.floor(5 - ratingNum);
    for (i = 0; i < full_stars; i++) {
      strStars.push(<Icon key={i + 'ios-star'} name="star" size={sizeStar} />);
    }
    for (i = 0; i < half_star; i++) {
      strStars.push(
        <Icon key={i + 'star-half'} name="star-half" size={sizeStar} />,
      );
    }
    for (i = 0; i < hole_star; i++) {
      strStars.push(
        <Icon key={i + 'star-outline'} name="star-outline" size={sizeStar} />,
      );
    }
    return strStars;
  },
  countObj: function (Obj) {
    var length = 0;
    for (var key in Obj) {
      if (Obj.hasOwnProperty(key)) {
        ++length;
      }
    }
    return length;
  },
  in_array: function (value, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == value) return i;
    }
    return false;
  },
  round10: function (x, n) {
    //x - число, n - количество знаков
    if (isNaN(x) || isNaN(n)) return false;
    var m = Math.pow(10, n);
    return Math.round(x * m) / m;
  },
  getMaxOfArray: function (numArray) {
    return Math.max.apply(null, numArray);
  },
  sklonenie: function (val, num1, num2_4, num5) {
    let last = parseInt(val.toString().slice(-1));
    if (val == 1 || (val > 20 && last == 1)) {
      return num1;
    }
    if ((val > 1 && val < 5) || (val > 20 && last > 1 && last < 5)) {
      return num2_4;
    }
    if (
      (val > 4 && val < 21) ||
      (val > 20 && last > 4 && last < 9) ||
      last == 0
    ) {
      return num5;
    }
  },
};
