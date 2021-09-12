import AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  signatureVersion: 'v4',
});
const s3 = new AWS.S3();
export default async function uploadImage(fileContent: string, fileType: string, key: string) {
  const params = {
    Key: key,
    ContentType: fileType,
    Body: Buffer.from(fileContent, 'base64'),
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  const result = await s3.putObject(params).promise();

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
