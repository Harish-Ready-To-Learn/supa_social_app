import {Appearance, StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {darkTheme, lightTheme} from './src/theme/theme';
import AuthNavigator from './src/authNavigator/AuthNavigator';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  const scheme = useColorScheme();
  useEffect(() => {
    const subscription = Appearance.addChangeListener(preferences => {
      // Your theme change logic (if necessary)
      console.log('Theme changed', preferences);
    });

    return () => {
      subscription.remove(); // Clean up listener when component unmounts
    };
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
