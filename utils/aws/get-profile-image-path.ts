import sha from 'crypto-js/sha256';

export default function getProfileImagePath(email: string) {
  const encodingKey = process.env.AWS_PROFILE_IMAGE_ENCODING_KEY || 'ab45G#%%!LPa';
  const directory = process.env.AWS_TREE_IMAGE_DIRECTORY ?? 'profile-images';

  return `${directory}/${sha(encodingKey + email).toString()}`;
}
