import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

const CustomBtn = () => {
  const [invisible, setInvisible] = useState(false);

  const onPressBtn = () => {
    timer = setTimeout(() => {
      setInvisible(true);
    }, [2000]);
  };

  return (
    <>
      {invisible ? (
        <></>
      ) : (
        <TouchableOpacity onPress={onPressBtn}>
          <Text>click here</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({});
