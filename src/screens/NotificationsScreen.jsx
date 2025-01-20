import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {fetchNotifications} from '../services/notificationsService';
import {hp, wp} from '../helpers/common';
import {useTheme} from '@react-navigation/native';
import ScreenWrapper from '../components/common/ScreenWrapper';
import NotificationItem from '../components/notifications/NotificationItem';
import Header from '../components/common/Header';

const NotificationsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState([]);
  const {user, setAuth} = useAuth();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  return (
    <ScreenWrapper bg={colors.commentBg}>
      <View style={styles.contianer}>
        <Header
          title="Notifications"
          onBackButtonPress={() => navigation.goBack()}
          mb={30}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}>
          {notifications.map(item => {
            return (
              <NotificationItem
                item={item}
                key={item?.id}
                navigation={navigation}
              />
            );
          })}
          {!notifications.length && (
            <Text style={styles.noData}>No Notifications Yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationsScreen;

const createStyles = colors =>
  StyleSheet.create({
    contianer: {
      flex: 1,
      paddingHorizontal: wp(4),
    },
    listStyle: {
      paddingVertical: 20,
      gap: 10,
    },
    noData: {
      fontSize: hp(1.8),
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
  });
