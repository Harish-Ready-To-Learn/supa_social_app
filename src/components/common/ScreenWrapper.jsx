import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ScreenWrapper = ({children, bg}) => {
  const {top} = useSafeAreaInsets();
  const topPadding = top ? top + 10 : top + 20;
  return (
    <View style={{flex: 1, paddingTop: topPadding, backgroundColor: bg}}>
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
