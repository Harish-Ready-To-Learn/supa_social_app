import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useIsFocused, useTheme} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import Header from '../components/common/Header';
import {hp, wp} from '../helpers/common';
import Icon from '../assets/icons';
import {supabase} from '../lib/supabase';
import Avatar from '../components/common/Avatar';
import {fetchPosts} from '../services/postService';
import Loading from '../components/common/Loading';
import PostCard from '../components/home/PostCard';

var limit = 0;

const ProfileScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const {colors} = useTheme();
  const {user, setAuth} = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [visibleItem, setVisibleItem] = useState(null);

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

  useEffect(() => {
    let postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        handlePostEvent,
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let {success, data} = await fetchPosts(limit, user.id);

    if (success) {
      if (posts.length == data.length) setHasMore(false);
      setPosts(data);
    }
    setLoading(false);
  };

  const onLogout = async () => {
    setLoading(true);
    const {error} = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      Alert.alert('Logout', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisibleItem(viewableItems[0]?.item?.id); // Set the first visible item
    }
  }).current;

  const UserHeader = ({user}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}>
        <View>
          <Header
            title="Profile"
            onBackButtonPress={() => navigation.goBack()}
            mb={30}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" color={colors.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={{gap: 15}}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image}
                size={hp(12)}
                rounded={22 * 1.4}
                style={{borderWidth: 1}}
              />
              <Pressable
                style={[
                  styles.editIcon,
                  {
                    backgroundColor: colors.background,
                    shadowColor: colors.text,
                  },
                ]}
                onPress={() => {
                  navigation.navigate('EditProfileScreen');
                }}>
                <Icon name="edit" strokeWidth={2.5} size={20} />
              </Pressable>
            </View>
            {/* User name and Address */}
            <View style={{alignItems: 'center', gap: 4}}>
              <Text style={[styles.userName, {color: colors.text}]}>
                {user && user?.name}
              </Text>
              <Text style={[styles.infoText, {color: colors.text}]}>
                {user && user?.address}
              </Text>
            </View>
            {/* email, phone and bip */}
            <View style={{gap: 10}}>
              <View style={styles.info}>
                <Icon name="mail" size={20} color={colors.text} />
                <Text style={[styles.infoText, {color: colors.text}]}>
                  {user && user?.email}
                </Text>
              </View>
              {user && user?.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={colors.text} />
                  <Text style={[styles.infoText, {color: colors.text}]}>
                    {user?.phoneNumber}
                  </Text>
                </View>
              )}
              {user && user?.bio && (
                <Text style={[styles.infoText, {color: colors.text}]}>
                  {user?.bio}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View style={[styles.container, {}]}>
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
          ListHeaderComponent={<UserHeader user={user} />}
          ListHeaderComponentStyle={{marginBottom: 30}}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listStyle: {
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
  },
});
