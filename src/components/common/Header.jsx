import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import BackButton from './BackButton';
import {hp} from '../../helpers/common';

const Header = ({title, showBackButton = true, mb = 10, onBackButtonPress}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, {marginBottom: mb}]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton onPress={onBackButtonPress} />
        </View>
      )}
      <Text style={[styles.title, {color: colors.text}]}>{title || ''}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: '700',
  },
});
