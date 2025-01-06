import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import {hp, wp} from '../helpers/common';
import {fetchPostDetails} from '../services/postService';
import PostCard from '../components/home/PostCard';
import {useAuth} from '../context/AuthContext';
import Loading from '../components/common/Loading';
import CustomTextInput from '../components/common/CustomTextInput';
import Icon from '../assets/icons';

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

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        <PostCard
          item={post}
          currentUser={user}
          navigation={navigation}
          isVisible={true}
          isScreenFocused={isFocused}
          showMoreIcons={false}
        />

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
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetailsScreen;

const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: wp(7),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    list: {
      paddingHorizontal: wp(4),
    },
    sendIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.8,
      borderColor: colors.primary,
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
