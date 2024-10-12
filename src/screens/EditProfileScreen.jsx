import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import Header from '../components/common/Header';
import {wp} from '../helpers/common';

const EditProfileScreen = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <ScreenWrapper bg={colors.background}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: wp(4),
        }}>
        <View>
          <Header
            title="Edit Profile"
            onBackButtonPress={() => navigation.goBack()}
            mb={30}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({});
