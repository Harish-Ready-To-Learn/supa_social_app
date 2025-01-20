import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {hp} from '../../helpers/common';
import Avatar from '../common/Avatar';
import moment from 'moment';

const NotificationItem = ({item, navigation}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const createdAt = moment(item?.created_at).format('MMM D');
  let {postId, commentId} = JSON.parse(item.data);
  const handleClick = () => {
    navigation.navigate('PostDetailsScreen', {
      pathName: 'notifications',
      postId: postId,
      commentId: commentId,
    });
  };
  return (
    <Pressable style={styles.container} onPress={handleClick}>
      <Avatar uri={item?.sender?.image} size={hp(5)} d />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, {color: colors.placeHolderTextcolor}]}>
          {item?.title}
        </Text>
      </View>
      <Text style={[styles.text]}>{createdAt}</Text>
    </Pressable>
  );
};

export default NotificationItem;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      backgroundColor: colors.background,
      borderWidth: 0.5,
      borderColor: colors.text,
      padding: 15,
      borderRadius: 18,
      borderCurve: 'continuous',
    },
    nameTitle: {
      flex: 1,
      gap: 2,
    },
    text: {
      fontSize: hp(1.6),
      fontWeight: '600',
      color: colors.text,
    },
  });
