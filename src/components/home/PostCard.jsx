import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Avatar from '../common/Avatar';
import {hp, stripHtmlTags, wp} from '../../helpers/common';
import moment from 'moment';
import Icon from '../../assets/icons';
import RenderHtml from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import {getUserImageSource} from '../../services/imageService';
// import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import {
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {createPostLikes, removePostLike} from '../../services/postService';

let timer = null;
const TIMEOUT = 500;
const debounce = (onSingle, onDouble) => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    onDouble();
  } else {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onSingle();
    }, TIMEOUT);
  }
};

const PostCard = ({
  item,
  currentUser,
  navigation,
  hasShadow = true,
  isVisible,
  isScreenFocused,
}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const videoPlayerRef = useRef(null);
  const doubleTapRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [tap, setTap] = useState('...');
  const [paused, setPaused] = useState(!isScreenFocused);

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
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 1,
  };

  useEffect(() => {
    setLikes(item?.postLikes);
    setLiked(
      item?.postLikes?.filter(like => like.userId == currentUser?.id)[0]
        ? true
        : false,
    );
  }, []);

  useEffect(() => {
    if (!isVisible || !isScreenFocused) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }, [isVisible, isScreenFocused]);

  useEffect(() => {
    if (tap === 'double tap') {
      onLike();
    }
    setTap('...'); // Reset tap state after 2 seconds
  }, [tap]);

  const createdAt = moment(item?.created_at).format('MMM D');

  const onSingleTap = () => {
    setPaused(prev => !prev); // Toggle play/pause on single tap
  };

  const onDoubleTap = () => {
    setTap('double tap'); // Set tap state to double tap when double-tapped
  };

  const debounce = (onSingle, onDouble) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      onDouble(); // Execute double tap logic if timer is cleared
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        onSingle(); // Execute single tap logic after timeout
      }, TIMEOUT);
    }
  };

  const onTapPost = () => {
    debounce(onSingleTap, onDoubleTap); // Handle both single and double taps
  };

  const onLike = async () => {
    if (tap == 'double tap' && liked) {
      return;
    }
    if (liked) {
      let updatedLikes = likes.filter(like => like.userId != currentUser?.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        Alert.alert('Post', 'Remove Like Error..!');
      }
      setLiked(false);
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLikes(data);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong..!');
      }
      setLiked(true);
    }
  };

  const openPostDetails = () => {
    navigation.navigate('PostDetailsScreen', {
      pathName: 'postDetails',
      postId: item?.id,
    });
  };

  const onShare = async () => {
    let content = {message: stripHtmlTags(item?.body)};
    if (item?.file) {
      content.url = getUserImageSource(item?.file, true);
    }
    Share.share(content);
  };

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

        <Pressable onPress={onTapPost}>
          {item?.file && item?.file?.includes('postImage') && (
            <FastImage
              source={{
                uri: getUserImageSource(item?.file, true),
                priority: FastImage.priority.high,
              }}
              style={styles.postMedia}
              resizeMode="cover"
            />
          )}

          {item?.file && item?.file?.includes('postVideo') && (
            <GestureHandlerRootView>
              <TapGestureHandler waitFor={doubleTapRef}>
                <TapGestureHandler
                  onHandlerStateChange={({nativeEvent}) => {
                    if (nativeEvent.state === State.ACTIVE) {
                      setTap('double tap'); // Trigger double tap logic
                    }
                  }}
                  numberOfTaps={2}
                  ref={doubleTapRef}>
                  <View>
                    <Video
                      ref={videoPlayerRef}
                      source={{uri: getUserImageSource(item?.file, true)}}
                      style={styles.postMedia}
                      paused={paused} // Control play/pause based on the state
                      resizeMode="cover"
                      repeat
                    />
                  </View>
                </TapGestureHandler>
              </TapGestureHandler>
            </GestureHandlerRootView>
          )}
        </Pressable>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={() => onLike()}>
            {liked ? (
              <Icon
                name="heartFill"
                size={24}
                fill={colors.error}
                color={colors.error}
              />
            ) : (
              <Icon name="heart" size={24} color={colors.text} />
            )}
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={() => openPostDetails()}>
            <Icon name="comment" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.count}>{0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={() => onShare()}>
            <Icon name="share" size={24} color={colors.text} />
          </TouchableOpacity>
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
    content: {
      gap: 10,
    },
    postMedia: {
      height: hp(40),
      width: '100%',
      borderRadius: 20,
      borderCurve: 'continuous',
    },
    postBody: {
      marginLeft: 5,
    },
    userName: {
      fontSize: hp(1.8),
      color: colors.text,
      fontWeight: '800',
    },
    postTime: {
      fontSize: hp(1.4),
      color: colors.placeHolderTextcolor,
      fontWeight: '500',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    footerButton: {
      marginLeft: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    count: {
      color: colors.text,
      fontSize: hp(1.8),
    },
  });
