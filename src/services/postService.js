import {supabase} from '../lib/supabase';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import * as tus from 'tus-js-client';

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
    console.log(data);
    return {success: true, data: data.path};
  } catch (error) {
    console.error(' uploading error:', error);
    return {success: false, msg: 'could not upload image.'};
  }
};

async function uploadLargeFile(folderName, filePath, isImage, userId) {
  try {
    const {
      data: {session},
    } = await supabase.auth.getSession();

    // Fetch the image from the local file path
    const fileUri = filePath.startsWith('file://')
      ? filePath
      : `file://${filePath}`;
    const base64File = await RNFS.readFile(fileUri, 'base64');
    const fileBuffer = Buffer.from(base64File, 'base64');

    // Convert the Buffer to a Blob using RNFetchBlob
    const fileBlob = RNFetchBlob.polyfill.Blob.build(fileBuffer, {
      type: isImage ? 'image/*' : 'video/*',
    });

    // Generate a unique file name using the current timestamp
    const fileName = `${userId + Date.now()}${
      isImage ? '_postImage.jpg' : '_postVideo.mp4'
    }`;

    const file = new File([fileUri], fileName);
    console.log('====================================');
    console.log(file);
    console.log('====================================');

    var upload = new tus.Upload(file, {
      endpoint:
        'https://bipaeijxntmtlvzdbrzm.supabase.co/storage/v1/upload/resumable',
      retryDelays: [0, 1000, 3000, 5000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        'x-upsert': 'true',
      },
      metadata: {
        bucketName: 'posts',
        objectName: fileName,
        contentType: isImage ? 'image/*' : 'video/*',
        cacheControl: 3600,
      },
      onError: function (error) {
        console.log('Failed because: ' + error);
        // return {success: false, msg: 'could not upload video.'};
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + '%');
      },
      onSuccess: function () {
        console.log('Download successfull', upload.file.name);
        console.log('Download successfull', upload.url);
        // return {success: true, data: data.path};
      },
    });

    // Start the upload
    await upload.start();
  } catch (error) {
    console.error('Error in uploading file:', error);
    return {success: false, msg: 'Could not upload the file.'};
  }
}

export const fetchPosts = async (limit = 10) => {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select(
        `
        *,
        user: users (id, name, image),
        postLikes (*)
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

export const createPostLikes = async postLike => {
  try {
    const {data, error} = await supabase
      .from('postLikes')
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log('Post Like Error => ', error);
      return {success: false, msg: 'Post Like Error.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('Post Like Error => ', error);
    console.log('====================================');
    return {success: false, msg: 'Post Like Error.'};
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const {error} = await supabase
      .from('postLikes')
      .delete()
      .eq('userId', userId)
      .eq('postId', postId);

    if (error) {
      console.log('Post Like Error => ', error);
      return {success: false, msg: 'Post Like Error.'};
    }
    return {success: true};
  } catch (error) {
    console.log('====================================');
    console.log('Post Like Error => ', error);
    console.log('====================================');
    return {success: false, msg: 'Post Like Error.'};
  }
};

export const fetchPostDetails = async postId => {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select(
        `
        *,
        user: users (id, name, image),
        postLikes (*)
        `,
      )
      .eq('id', postId)
      .single();

    if (error) {
      console.log('got error while fetching Post details => ', error);
      return {success: false, msg: 'could not fetch post details.'};
    }
    return {success: true, data: data};
  } catch (error) {
    console.log('====================================');
    console.log('got error while fetching Post details => ', error);
    console.log('====================================');
    return {success: false, msg: 'Could not fetch the post details.'};
  }
};
