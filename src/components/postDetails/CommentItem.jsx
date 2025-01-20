import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {hp} from '../../helpers/common';
import Avatar from '../common/Avatar';
import moment from 'moment';
import Icon from '../../assets/icons';

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {},
  highlight = false,
}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const createdAt = moment(item?.created_at).format('MMM d');
  const [highlightState, setHighlightState] = useState(highlight);

  setTimeout(() => {
    if (highlightState) {
      setHighlightState(false);
    }
  }, 2000);

  const handleDeleteComment = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete the comment?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'yes',
        onPress: () => onDelete(item),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} size={hp(4)} />
      <View style={[styles.content, highlightState && styles.highlight]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.name}</Text>
            <Text style={styles.text}>.</Text>
            <Text style={[styles.text, {color: colors.placeHolderTextcolor}]}>
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <Pressable onPress={handleDeleteComment}>
              <Icon name="delete" size={18} color={colors.error} />
            </Pressable>
          )}
        </View>
        <Text style={[styles.text, {fontWeight: '400'}]}>{item?.comment}</Text>
      </View>
    </View>
  );
};

export default CommentItem;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 1,
      gap: 7,
    },
    content: {
      backgroundColor: colors.commentBg,
      flex: 1,
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      borderCurve: 'continuous',
    },
    highlight: {
      borderWidth: 0.2,
      backgroundColor: colors.background,
      borderColor: colors.text,
      shadowColor: colors.text,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    text: {
      fontSize: hp(1.6),
      fontWeight: '600',
      color: colors.text,
    },
  });
