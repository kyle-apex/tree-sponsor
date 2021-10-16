import getTreeImagePath from './get-tree-image-path';
import uploadImage from './upload-image';
import sharp from 'sharp';

export default async function uploadTreeImages(imageUrl: string, uuid: string) {
  const imagePath = getTreeImagePath(uuid);

  const fileContent = imageUrl.split(',')[1];
  const imgBuffer = Buffer.from(fileContent, 'base64');

  sharp(imgBuffer)
    .rotate()
    .resize(500)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then((data: Buffer) => {
      uploadImage(data, 'image/jpeg', imagePath + '/small');
    });

  await uploadImage(fileContent, imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';')), imagePath + '/full');

  sharp(imgBuffer)
    .rotate()
    .resize(50)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then((data: Buffer) => {
      uploadImage(data, 'image/jpeg', imagePath + '/thumbnail');
    });
}
