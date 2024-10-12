import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {hp} from '../../helpers/common';
import {useTheme} from '@react-navigation/native';
import Loading from './Loading';

const CustomButton = ({
  buttonStyle,
  textStyle,
  title = '',
  onPress = () => {},
  loading = false,
  hasShadow = true,
  colors,
}) => {
  const shadowStyle = {
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.background,
            height: hp(6.6),
            justifyContent: 'center',
            alignItems: 'center',
            borderCurve: 'continuous',
            borderRadius: 18,
          },
          buttonStyle,
          ,
        ]}>
        <Loading color={colors.primary} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.primary,
          height: hp(6.6),
          justifyContent: 'center',
          alignItems: 'center',
          borderCurve: 'continuous',
          borderRadius: 18,
        },
        buttonStyle,
        hasShadow && shadowStyle,
      ]}>
      <Text
        style={[
          {
            fontSize: hp(2.5),
            color: colors.background,
            fontWeight: 700,
          },
          textStyle,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
