import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Avatar from '../common/Avatar';
import {hp, wp} from '../../helpers/common';
import moment from 'moment';
import Icon from '../../assets/icons';
import RenderHtml from 'react-native-render-html';

const PostCard = ({item, currentUser, navigation, hasShadow = true}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  const textStyles = {
    color: colors.text,
    fontSize: hp(1.75),
  };

  const tagStyles = {
    div: textStyles,
    p: textStyles,
    ol: textStyles,
    h1: {
      color: colors.dark,
    },
    h4: {
      color: colors.dark,
    },
  };

  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
  };

  const createdAt = moment(item?.created_at).format('MMM D');
  const openPostDetails = () => {};

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar uri={item?.user?.image} size={hp(4.5)} rounded={8} />
          <View style={{gap: 2}}>
            <Text style={styles.userName}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{
                html: item?.body,
              }}
              tagsStyles={tagStyles}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      gap: 10,
      marginBottom: 15,
      borderRadius: 22,
      borderCurve: 'continuous',
      padding: 10,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderWidth: 0.5,
      borderColor: colors.text,
      shadowColor: colors.text,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
