import {supabase} from '../lib/supabase';

export const createPostNotification = async notification => {
  try {
    const {data, error} = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log('notification Error => ', error);
      return {success: false, msg: 'notification Error.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('notification Error => ', error);
    console.log('====================================');
    return {success: false, msg: 'notification Error.'};
  }
};

export const fetchNotifications = async receiverId => {
  try {
    const {data, error} = await supabase
      .from('notifications')
      .select(
        `
          *,
          sender: senderId(id, name, image)
          `,
      )
      .eq('receiverId', receiverId)
      .order('created_at', {ascending: false});

    if (error) {
      console.log('got error while fetching notifications => ', error);
      return {success: false, msg: 'could not fetch notifications.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('got error while fetching notifications => ', error);
    console.log('====================================');
    return {success: false, msg: 'Could not fetch the notifications.'};
  }
};
