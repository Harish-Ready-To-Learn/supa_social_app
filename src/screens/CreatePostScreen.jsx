import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenWrapper from '../components/common/ScreenWrapper';
import {useTheme} from '@react-navigation/native';
import {hp, wp} from '../helpers/common';
import Header from '../components/common/Header';
import {useAuth} from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import RichTextEditor from '../components/CreatePost/RichTextEditor';

const CreatePostScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);
  const {user, setAuth, setUserData} = useAuth();

  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

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
        </ScrollView>
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
  });
