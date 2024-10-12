import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import Header from '../components/common/Header';
import {hp, wp} from '../helpers/common';
import Icon from '../assets/icons';
import {supabase} from '../lib/supabase';
import Avatar from '../components/common/Avatar';

const ProfileScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {user, setAuth} = useAuth();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      Alert.alert('Logout', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  const UserHeader = ({user}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}>
        <View>
          <Header
            title="Profile"
            onBackButtonPress={() => navigation.goBack()}
            mb={30}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" color={colors.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={{gap: 15}}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image}
                size={hp(12)}
                rounded={22 * 1.4}
                style={{borderWidth: 1}}
              />
              <Pressable
                style={[
                  styles.editIcon,
                  {
                    backgroundColor: colors.background,
                    shadowColor: colors.text,
                  },
                ]}
                onPress={() => {
                  navigation.navigate('EditProfileScreen');
                }}>
                <Icon name="edit" strokeWidth={2.5} size={20} />
              </Pressable>
            </View>
            {/* User name and Address */}
            <View style={{alignItems: 'center', gap: 4}}>
              <Text style={[styles.userName, {color: colors.text}]}>
                {user && user?.data?.name}
              </Text>
              <Text style={[styles.infoText, {color: colors.text}]}>
                {user && user?.data?.address}
              </Text>
            </View>
            {/* email, phone and bip */}
            <View style={{gap: 10}}>
              <View style={styles.info}>
                <Icon name="mail" size={20} color={colors.text} />
                <Text style={[styles.infoText, {color: colors.text}]}>
                  {user && user?.data?.email}
                </Text>
              </View>
              {user && user.data.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} col or={colors.text} />
                  <Text style={[styles.infoText, {color: colors.text}]}>
                    {user?.data?.phoneNumber}
                  </Text>
                </View>
              )}
              {user && user.data.bio && (
                <Text style={[styles.infoText, {color: colors.text}]}>
                  {user?.data?.bio}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={[styles.container, {}]}>
        <UserHeader user={user} />
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listStyle: {
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
  },
});
