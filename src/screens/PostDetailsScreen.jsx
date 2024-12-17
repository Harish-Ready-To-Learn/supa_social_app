import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useTheme} from '@react-navigation/native';
import {hp} from '../helpers/common';
import {fetchPostDetails} from '../services/postService';

const PostDetailsScreen = () => {
  const route = useRoute();
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const [post, setPost] = useState(null);
  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    console.log('data');
    let {success, data} = await fetchPostDetails(route.params?.postId);
    if (success) {
      setPost(data);
    }
  };

  return (
    <View style={{height: hp(50)}}>
      <Text>{post?.userId}</Text>
    </View>
  );
};

export default PostDetailsScreen;

const createStyles = colors => StyleSheet.create({});
