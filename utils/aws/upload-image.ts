import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  signatureVersion: 'v4',
});
const s3 = new AWS.S3();
export default async function uploadImage(fileContent: string | Buffer, fileType: string, key: string) {
  const body = fileContent instanceof Buffer ? fileContent : Buffer.from(fileContent, 'base64');
  const params: PutObjectRequest = {
    Key: key,
    ContentType: fileType,
    Body: body,
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME ?? '',
  };

  const result = await s3.putObject(params).promise();

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
