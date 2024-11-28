import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useGetLocalData = async name => {
  let data = await AsyncStorage.getItem(name);
  if (!data)
    return {
      msg: 'failed',
      data: data,
    };
  return {
    msg: 'data retreived successfully',
    data: data,
  };
};

export default useGetLocalData;
