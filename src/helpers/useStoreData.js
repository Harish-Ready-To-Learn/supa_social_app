import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStoreData = data => {
  AsyncStorage.setItem('data', data);
  return {msg: 'Data stored successfully'};
};

export default useStoreData;
