import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import CustomButton from '../components/common/CustomButton';
import {useTheme} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../lib/supabase';
import {hp, wp} from '../helpers/common';
import Icon from '../assets/icons';
import Avatar from '../components/common/Avatar';
import {fetchPosts} from '../services/postService';
import PostCard from '../components/home/PostCard';

var limit = 0;
const HomeScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {user, setAuth} = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    limit = limit + 10;
    let {success, data} = await fetchPosts(limit);
    if (success) {
      setPosts(data);
    }
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={[styles.container, {}]}>
        {/* HEADER */}
        <View style={[styles.header, {}]}>
          <Text style={[styles.title, {color: colors.text}]}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => navigation.navigate('NotificationsScreen')}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={colors.text}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('CreatePostScreen')}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={colors.text}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
              <Avatar
                uri={user?.image}
                size={hp(4.5)}
                rounded={8}
                style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <PostCard item={item} currentUser={user} navigation={navigation} />
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: hp(3.2),
    fontWeight: '900',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
});
