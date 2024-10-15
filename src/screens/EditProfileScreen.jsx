import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import Header from '../components/common/Header';
import {hp, wp} from '../helpers/common';
import {useAuth} from '../context/AuthContext';
import FastImage from 'react-native-fast-image';
import {getUserImageSource} from '../services/imageService';
import Icon from '../assets/icons';
import CustomTextInput from '../components/common/CustomTextInput';
import CustomButton from '../components/common/CustomButton';
import {updateUser} from '../services/userService';

const EditProfileScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {user: currentUser, setAuth, setUserData} = useAuth();
  const [userDetails, setUserDetails] = useState({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserDetails({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || '',
        bio: currentUser.bio || '',
        address: currentUser.address || '',
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {};

  const onSubmit = async () => {
    let userData = {...userDetails};
    let {name, phoneNumber, address, image, bio} = userData;

    if (!name || !phoneNumber || !address || !bio) {
      Alert.alert('Profile', 'Please fill all the fields!');
      return;
    }
    setLoading(true);
    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);
    console.log(res);
    if (res.success) {
      setUserData({...currentUser, ...userData});
      navigation.goBack();
    } else {
      Alert.alert('Update Profile', res.msg);
    }
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: wp(4),
        }}>
        <ScrollView style={{flex: 1}}>
          <Header
            title="Edit Profile"
            onBackButtonPress={() => navigation.goBack()}
          />
          {/* Form */}
          <View style={styles.form}>
            <View style={[styles.avatarContainer, {}]}>
              <FastImage
                source={{
                  uri: userDetails?.image
                    ? getUserImageSource(userDetails?.image)
                    : undefined, // Profile image URL
                  priority: FastImage.priority.high,
                }}
                style={[styles.avatar, {borderColor: colors.text}]}
                defaultSource={require('../assets/images/defaultUser.png')}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Pressable
                style={[
                  styles.cameraIcon,
                  {
                    backgroundColor: colors.background,
                    shadowColor: colors.text,
                  },
                ]}
                onPress={onPickImage}>
                <Icon name="camera" strokeWidth={2.5} size={20} />
              </Pressable>
            </View>
            <Text style={{fontSize: hp(2), color: colors.text}}>
              Please fill your profile details.
            </Text>
            <CustomTextInput
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              onChangeText={value => {
                setUserDetails({...userDetails, name: value});
              }}
              value={userDetails?.name}
            />
            <CustomTextInput
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              onChangeText={value => {
                setUserDetails({...userDetails, phoneNumber: value});
              }}
              value={userDetails?.phoneNumber}
            />
            <CustomTextInput
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              onChangeText={value => {
                setUserDetails({...userDetails, address: value});
              }}
              value={userDetails?.address}
            />
            <CustomTextInput
              placeholder="Enter your bio"
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value => {
                setUserDetails({...userDetails, bio: value});
              }}
              value={userDetails?.bio}
            />
            <CustomButton
              title="Update"
              loading={loading}
              onPress={onSubmit}
              colors={colors}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20 * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
});
