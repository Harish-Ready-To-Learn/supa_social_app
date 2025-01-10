import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import {hp, wp} from '../helpers/common';
import {createComment, fetchPostDetails} from '../services/postService';
import PostCard from '../components/home/PostCard';
import {useAuth} from '../context/AuthContext';
import Loading from '../components/common/Loading';
import CustomTextInput from '../components/common/CustomTextInput';
import Icon from '../assets/icons';
import {count} from 'console';
import CommentItem from '../components/postDetails/CommentItem';
import ScreenWrapper from '../components/common/ScreenWrapper';

const PostDetailsScreen = ({navigation}) => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);
  const commentRef = useRef(null);

  const {user, setAuth} = useAuth();

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    let {success, data} = await fetchPostDetails(route.params?.postId);
    if (success) {
      setPost(data);
      setLoading(false);
    }
  };

  const onNewComment = async () => {
    if (!commentRef.current) return;
    let data = {
      userId: user?.id,
      postId: post?.id,
      comment: commentRef.current,
    };

    const res = await createComment(data);
    if (res.success) {
      commentRef.current = '';
      inputRef.current.clear();
    } else {
      Alert.alert('Comment', 'Could not post the comment.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
        <Text style={styles.notFound}>Post Not Found!</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled
      keyboardVerticalOffset={100}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        <PostCard
          item={{...post, comments: [{count: post?.comments?.length}]}}
          currentUser={user}
          navigation={navigation}
          isVisible={true}
          isScreenFocused={isFocused}
          showMoreIcons={false}
        />

        <View style={{marginVertical: 15, gap: 17, marginBottom: 120}}>
          {post?.comments?.map(comment => (
            <CommentItem key={comment?.id?.toString()} item={comment} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <CustomTextInput
          inputRef={inputRef}
          placeholder="Type Comment..."
          placeHolderTextColor={colors.text}
          containerStyle={{
            flex: 1,
            height: hp(6.2),
            borderRadius: 14,
          }}
          onChangeText={value => (commentRef.current = value)}
        />
        {loading ? (
          <View style={styles.loading}>
            <Loading color={colors.primary} size="small" />
          </View>
        ) : (
          <Pressable style={styles.sendIcon} onPress={onNewComment}>
            <Icon name="send" size={24} color={colors.primary} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetailsScreen;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingVertical: wp(7),
      height: '100%',
      zIndex: 0,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: wp(4),
      backgroundColor: colors.background,
      height: 100,
    },
    list: {
      paddingHorizontal: wp(4),
    },
    sendIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.8,
      borderRadius: 18,
      borderCurve: 'continuous',
      height: hp(5.8),
      width: hp(5.8),
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFound: {
      fontSize: hp(2.5),
      color: colors.text,
      fontWeight: '600',
    },
    loading: {
      height: hp(5.8),
      width: hp(5.8),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{scale: 1.3}],
    },
  });
