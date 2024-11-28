import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {hp} from '../../helpers/common';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import {getUserImageSource} from '../../services/imageService';

const Avatar = ({uri, size = hp(4.5), rounded = 10, style = {}}) => {
  const {colors} = useTheme();
  return (
    <FastImage
      source={
        uri
          ? {uri: getUserImageSource(uri), priority: FastImage.priority.high}
          : require('../../assets/images/defaultUser.png')
      }
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded,
          borderColor: colors.text,
        },
        style,
      ]}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderWidth: 1,
  },
});
