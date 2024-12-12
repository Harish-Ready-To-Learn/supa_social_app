import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Dummy = ({route}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route?.params?.name}</Text>
    </View>
  );
};

export default Dummy;

const styles = StyleSheet.create({});
