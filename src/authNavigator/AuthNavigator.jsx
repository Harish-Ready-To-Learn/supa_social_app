import {Appearance, StyleSheet, useColorScheme, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../lib/supabase';
import {useNavigation} from '@react-navigation/native';
import {getUserData} from '../services/userService';
import Loading from '../components/common/Loading';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const {user, setAuth, setUserData} = useAuth();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize with null for loading state

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Replace with actual login logic (e.g., from async storage or an API)
      const loggedIn = await fetchLoginStatus(); // Example function
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  const updateUserData = async user => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData(res);
    }
  };

  const fetchLoginStatus = async () => {
    // Simulate login check (e.g., check async storage or make an API call)
    return new Promise(resolve => {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setAuth(session?.user);
          updateUserData(session?.user);
          setTimeout(() => {
            resolve(true); // Return true for logged in, false otherwise
          }, 2000); // Simulate a delay
        } else {
          setAuth(null);
          setTimeout(() => {
            resolve(false); // Return true for logged in, false otherwise
          }, 100); // Simulate a delay
        }
      });
    });
  };

  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Loading />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isLoggedIn ? 'HomeScreen' : 'WelcomeScreen'}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

const styles = StyleSheet.create({});
