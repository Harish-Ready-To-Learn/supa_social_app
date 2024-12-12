import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {wp} from '../helpers/common';

const NotificationsScreen = ({navigation}) => {
  const [name, setName] = useState('');

  const goTo = () => {
    console.log(name);
    navigation.navigate('dummy', {name: name});
  };

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <TextInput
        style={{borderWidth: 1, height: 30, width: wp(100)}}
        onChangeText={setName}
        value={name}
      />
      <TouchableOpacity
        onPress={() => {
          goTo();
        }}>
        <Text>Click here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
