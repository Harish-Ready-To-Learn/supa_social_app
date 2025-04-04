import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import CustomButton from '../components/common/CustomButton';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../lib/supabase';
import {hp, wp} from '../helpers/common';
import Icon from '../assets/icons';
import Avatar from '../components/common/Avatar';
import {fetchPosts} from '../services/postService';
import PostCard from '../components/home/PostCard';
import Loading from '../components/common/Loading';
import {getUserData} from '../services/userService';

var limit = 0;
const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const {user, setAuth} = useAuth();

  const [posts, setPosts] = useState([]);
  const [visibleItem, setVisibleItem] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const viewabilityConfig = {itemVisiblePercentThreshold: 250};

  const handlePostEvent = async payload => {
    if (payload.eventType == 'INSERT' && payload?.new?.id) {
      let newPost = {...payload.new};
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      newPost.postLikes = [];
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
    if (payload.eventType == 'DELETE' && payload?.old?.id) {
      setPosts(prevPosts => {
        prevPosts = prevPosts.filter(post => post.id != payload?.old?.id);
        return prevPosts;
      });
    }
    if (payload.eventType == 'UPDATE' && payload?.old?.id) {
      setPosts(prevPosts => {
        let updatedPosts = prevPosts.map(post => {
          if (post.id == payload?.old?.id) {
            post.body = payload?.new?.body;
            post.file = payload?.new?.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async payload => {
    if (payload.eventType == 'INSERT' && payload?.new?.id) {
      setNotificationCount(prevCount => prevCount + 1);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        handlePostEvent,
      )
      .subscribe();

    let notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNewNotification,
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    let {success, data} = await fetchPosts(limit);
    if (success) {
      if (posts.length == data.length) setHasMore(false);
      setPosts(data);
    }
    setLoading(false);
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisibleItem(viewableItems[0]?.item?.id); // Set the first visible item
    }
  }).current;

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={[styles.container, {}]}>
        {/* HEADER */}
        <View style={[styles.header, {}]}>
          <Text style={[styles.title, {color: colors.text}]}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                navigation.navigate('NotificationsScreen');
              }}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
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
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          decelerationRate="normal"
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <PostCard
              item={item}
              currentUser={user}
              navigation={navigation}
              isVisible={item.id === visibleItem}
              isScreenFocused={isFocused}
            />
          )}
          ListFooterComponent={
            hasMore ? (
              <View style={{marginVertical: 30}}>
                <Loading />
              </View>
            ) : (
              <View style={{marginVertical: 30}}>
                <Text style={styles.noPosts}>No More Posts...!</Text>
              </View>
            )
          }
          onEndReached={() => {
            getPosts();
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const createStyles = colors =>
  StyleSheet.create({
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
      paddingHorizontal: wp(2),
    },
    noPosts: {
      fontSize: hp(2),
      textAlign: 'center',
      color: colors.text,
    },
    pill: {
      position: 'absolute',
      right: -10,
      top: -4,
      height: hp(2.2),
      width: hp(2.2),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: colors.error,
    },
    pillText: {
      fontSize: hp(1.2),
      color: colors.background,
      fontWeight: '800',
    },
  });
