import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import {hp, wp} from '../helpers/common';
import CustomButton from '../components/common/CustomButton';

const WelcomeScreen = ({navigation}) => {
  const {colors} = useTheme();

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Image
          style={{
            height: hp(30),
            width: wp(100),
            alignSelf: 'center',
          }}
          source={require('../assets/images/welcome.png')}
          resizeMode="contain"
        />
        <View style={{gap: 20}}>
          <Text
            style={{
              color: colors.text,
              fontSize: hp(4),
              textAlign: 'center',
              fontWeight: '900',
            }}>
            LinkUp!
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: hp(1.7),
              textAlign: 'center',
              paddingHorizontal: wp(10),
            }}>
            Where every thought finds a home and every image tells a story.
          </Text>
        </View>
        <View style={{gap: 30, width: '100%'}}>
          <CustomButton
            title="Getting Started"
            buttonStyle={{marginHorizontal: wp(3)}}
            onPress={() => navigation.navigate('SignupScreen')}
            colors={colors}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.text,
                fontSize: hp(2),
              }}>
              Already have an account?
            </Text>
            <Pressable onPress={() => navigation.navigate('LoginScreen')}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.primary,
                  fontSize: hp(2),
                  fontWeight: '700',
                }}>
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(4),
  },
});
