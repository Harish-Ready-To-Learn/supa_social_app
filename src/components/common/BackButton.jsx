import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Icon from '../../assets/icons';

const BackButton = ({size = 26, onPress}) => {
  const {colors} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 8,
        backgroundColor: colors.buttonBackground,
      }}>
      <Icon
        name="arrowLeft"
        strokeWidth={2.5}
        size={size}
        color={colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({});
