import {supabase} from '../lib/supabase';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

export const createOrUpdatePost = async post => {
  try {
    // Upload Image
    if (post.file && typeof post.file == 'object') {
      let isImage = post?.file?.mime == 'image/jpeg';
      let folderName = isImage ? 'postImages' : 'postVideos';
      let fileResult = await uploadFile(
        folderName,
        post?.file?.path,
        isImage,
        post?.userId,
      );
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }
    const {data, error} = await supabase.from('posts').upsert(post).select();
    if (error) {
      console.log('====================================');
      console.log('got error while adding Post => ', error);
      console.log('====================================');
      return {success: false, msg: 'Could not create your post.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('got error while adding Post => ', error);
    console.log('====================================');
    return {success: false, msg: 'Could not create your post.'};
  }
};

const uploadFile = async (folderName, filePath, isImage, userId) => {
  try {
    // Fetch the image from the local file path
    const fileUri = filePath.startsWith('file://')
      ? filePath
      : `file://${filePath}`;
    const base64File = await RNFS.readFile(fileUri, 'base64');
    const fileBuffer = Buffer.from(base64File, 'base64');

    // Generate a unique file name using the current timestamp
    const fileName = `${userId + Date.now()}${
      isImage ? '_postImage.jpg' : '_postVideo.mp4'
    }`;

    const folderName = isImage ? 'images' : 'videos';
    const fileNameWithFolder = `${folderName}/${fileName}`;

    // Upload the file to Supabase Storage
    const {data, error} = await supabase.storage
      .from('posts')
      .upload(fileNameWithFolder, fileBuffer, {
        cacheControl: '3600',
        contentType: isImage ? 'image/*' : 'video/*',
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

export const fetchPosts = async (limit = 10) => {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select(
        `
        *,
        user: users (id, name, image)
        `,
      )
      .order('created_at', {ascending: false})
      .limit(limit);

    if (error) {
      console.log('got error while fetching Posts => ', error);
      return {success: false, msg: 'could not fetch posts.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('got error while fetching Posts => ', error);
    console.log('====================================');
    return {success: false, msg: 'Could not fetch the posts.'};
  }
};
