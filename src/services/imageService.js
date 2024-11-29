import {supabase} from '../lib/supabase';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

export const getUserImageSource = (imagePath, isPost = false) => {
  if (imagePath) {
    return getSupabseProfileImage(imagePath, isPost);
  } else {
    return require('../assets/images/defaultUser.png');
  }
};

export const getSupabseProfileImage = (filePath, isPost) => {
  if (filePath) {
    return `https://bipaeijxntmtlvzdbrzm.supabase.co/storage/v1/object/public/${
      isPost ? 'posts' : 'user_profile_image'
    }/${filePath}`;
  }
  return null;
};

export const uploadProfileImage = async (imagePath, userId) => {
  try {
    // Fetch the image from the local file path
    const fileUri = imagePath.startsWith('file://')
      ? imagePath
      : `file://${imagePath}`;
    const base64Image = await RNFS.readFile(fileUri, 'base64');
    const fileBuffer = Buffer.from(base64Image, 'base64');

    // Generate a unique file name using the current timestamp
    const fileName = `${userId + Date.now()}_profile.jpg`;

    // Upload the file to Supabase Storage
    const {data, error} = await supabase.storage
      .from('user_profile_image')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    if (error) {
      console.error('Error in uploading image:', error);
      return {success: false, msg: 'could not upload image.'};
    }
    return {success: true, data: data.path};
  } catch (error) {
    console.error('Error in uploading image:', error);
    return {success: false, msg: 'could not upload image.'};
  }
};
