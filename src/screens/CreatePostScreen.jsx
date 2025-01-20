import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useRoute, useTheme} from '@react-navigation/native';
import {hp, wp} from '../helpers/common';
import Header from '../components/common/Header';
import {useAuth} from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import RichTextEditor from '../components/CreatePost/RichTextEditor';
import Icon from '../assets/icons';
import CustomButton from '../components/common/CustomButton';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import VideoPlayer from 'react-native-video-controls';
import {createOrUpdatePost} from '../services/postService';
import {getUserImageSource} from '../services/imageService';

const CreatePostScreen = ({navigation}) => {
  const route = useRoute();

  const {colors} = useTheme();
  const styles = createStyles(colors);
  const {user, setAuth, setUserData} = useAuth();

  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  useEffect(() => {
    if (route?.params?.post && route?.params?.post.id) {
      bodyRef.current = route?.params?.post.body;
      setFile(route?.params?.post.file || null);
      setTimeout(() => {
        editorRef.current?.setContentHTML(bodyRef.current);
      }, 1000);
    }
  }, []);

  const onPick = async isImage => {
    const options = {
      mediaType: isImage ? 'photo' : 'video',
      // includeBase64: false, // Ensure base64 isn't being used
      // compressVideoPreset: 'Passthrough', // Avoid compression
    };

    if (isImage) {
      // options.width = 300;
      // options.height = 400;
      options.cropping = true;
    } else {
    }
    await ImagePicker.openPicker(options)
      .then(file => {
        setFile(file);
      })
      .catch(error => {
        console.log('Error picking image:', error);
      });
  };

  const isLocalFile = file => {
    if (!file) return null;
    if (typeof file == 'object') return true;
    return false;
  };

  const getFileType = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.mime == 'video/mp4' ? 'video' : 'image';
    }
    if (file.includes('postImage')) {
      return 'image';
    }
    return 'video';
  };

  const getFileUri = file => {
    if (!file) return null;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert('Post', 'Please choose an image or add the post body.');
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };
    if (route?.params?.post && route?.params?.post.id)
      data.id = route?.params?.post.id;
    setLoading(true);
    const result = await createOrUpdatePost(data);
    setLoading(false);
    if (result.success) {
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      navigation.goBack();
    } else {
      Alert.alert('Post', result.msg);
    }
  };

  return (
    <ScreenWrapper bg={colors.background}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: wp(4),
          marginBottom: 30,
          gap: 15,
        }}>
        <Header
          title="Create Post"
          onBackButtonPress={() => navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{gap: 20}}>
          {/* Avatar */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={18}
              style={{borderWidth: 1}}
            />
            <View style={{gap: 2}}>
              <Text style={styles.userName}>{user && user.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChangeBodyText={bodyText => (bodyRef.current = bodyText)}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) == 'video' ? (
                <VideoPlayer
                  source={{
                    uri: isLocalFile(file)
                      ? file.path
                      : getUserImageSource(file, (isPost = true)),
                  }}
                  style={{flex: 1}}
                  disableBack={true}
                />
              ) : (
                <FastImage
                  source={
                    {
                      uri: isLocalFile(file)
                        ? file.path
                        : getUserImageSource(file, (isPost = true)),
                      priority: FastImage.priority.high,
                    } // Fallback to default image if URI is undefined
                  }
                  style={{flex: 1}}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          )}
          <View style={styles.mediaContainer}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon
                  name="video"
                  size={33}
                  color={colors.text}
                  style={styles.imageIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <CustomButton
          buttonStyle={{height: hp(6.2)}}
          title={
            route?.params?.post && route?.params?.post.id ? 'Update' : 'Post'
          }
          loading={loading}
          onPress={onSubmit}
          hasShadow={false}
          colors={colors}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CreatePostScreen;

const createStyles = colors =>
  StyleSheet.create({
    title: {
      fontSize: hp(2.5),
      fontWeight: '700',
      textAlign: 'center',
      color: colors.text, // Access color from the theme
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userName: {
      fontSize: hp(2.2),
      fontWeight: '700',
      color: colors.text,
    },
    publicText: {
      fontSize: hp(1.7),
      fontWeight: '500',
      color: colors.placeHolderTextcolor,
    },
    avatar: {
      height: hp(6.5),
      width: hp(6.5),
      borderRadius: 18,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: colors.text,
    },
    mediaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1.5,
      padding: 12,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderCurve: 'continuous',
      borderColor: colors.darkLight,
    },
    mediaIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    addImageText: {
      fontSize: hp(1.9),
      fontWeight: '700',
      color: colors.text,
    },
    imageIcon: {},
    file: {
      height: hp(30),
      width: '100%',
      borderRadius: 20,
      overflow: 'hidden',
      borderCurve: 'continuous',
    },
    closeIcon: {
      position: 'absolute',
      top: 10,
      left: 10,
      padding: 7,
      borderRadius: 50,
      backgroundColor: 'rgba(255,0,0, 0.6)',
    },
  });
