import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import BackButton from '../components/common/BackButton';
import {hp, wp} from '../helpers/common';
import CustomTextInput from '../components/common/CustomTextInput';
import Icon from '../assets/icons';
import CustomButton from '../components/common/CustomButton';
import {supabase} from '../lib/supabase';

const LoginScreen = ({navigation}) => {
  const {colors} = useTheme();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Login', 'Please fill all the fields!');
      return;
    }

    let email = emailRef.current.trim();
    setLoading(true);
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: passwordRef.current,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Login', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    }
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={styles.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <View>
          <Text style={[styles.welcomeText, {color: colors.text}]}>Hey,</Text>
          <Text style={[styles.welcomeText, {color: colors.text}]}>
            Welcome Back.
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={{fontSize: hp(2), color: colors.text}}>
            Please login to continue.
          </Text>
          <CustomTextInput
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={value => (emailRef.current = value)}
          />
          <CustomTextInput
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={value => (passwordRef.current = value)}
            secureTextEntry={true}
          />
          <Text style={[styles.forgotPassword, {color: colors.text}]}>
            Forgot Password?
          </Text>
          <CustomButton
            title="Login"
            loading={loading}
            onPress={onSubmit}
            colors={colors}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: colors.text}]}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate('SignupScreen')}>
            <Text
              style={[
                styles.footerText,
                {color: colors.primary, fontWeight: '700'},
              ]}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: '900',
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: hp(2),
  },
});
