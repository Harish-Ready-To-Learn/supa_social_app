export const getUserImageSource = imagePath => {
  if (imagePath) {
    return imagePath;
  } else {
    return require('../assets/images/defaultUser.png');
  }
};
