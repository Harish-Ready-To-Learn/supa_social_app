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

const SignupScreen = ({navigation}) => {
  const {colors} = useTheme();
  const nameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();

    setLoading(true);

    const {
      data: {session},
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: passwordRef.current,
      options: {
        data: {
          name: name,
          email: email,
        },
      },
    });
    if (error) {
      Alert.alert('Sign Up', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={styles.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <View>
          <Text style={[styles.welcomeText, {color: colors.text}]}>Let's,</Text>
          <Text style={[styles.welcomeText, {color: colors.text}]}>
            Get Started.
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={{fontSize: hp(2), color: colors.text}}>
            Please fill the details to create a new account.
          </Text>
          <CustomTextInput
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your name"
            onChangeText={value => (nameRef.current = value)}
          />
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
          <CustomButton
            title="Sign Up"
            loading={loading}
            onPress={onSubmit}
            colors={colors}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: colors.text}]}>
            Already have an account!
          </Text>
          <Pressable onPress={() => navigation.navigate('LoginScreen')}>
            <Text
              style={[
                styles.footerText,
                {color: colors.primary, fontWeight: '700'},
              ]}>
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignupScreen;

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
