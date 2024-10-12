import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {hp} from '../../helpers/common';

const CustomTextInput = props => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.container,
        props.containerStyle && props.containerStyle,
        {borderColor: colors.text},
      ]}>
      {props.icon && props.icon}
      <TextInput
        style={{flex: 1, color: colors.text}}
        placeholderTextColor={colors.placeHolderTextcolor}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderRadius: 18,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12,
  },
});
