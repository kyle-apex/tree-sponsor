export default function getBase64ImageDimensions(base64Image: string): { width: number; height: number } {
  const sizeOf = require('image-size');
  const buffer = Buffer.from(base64Image.substring(base64Image.indexOf(',') + 1, base64Image.length), 'base64');
  const { width, height } = sizeOf(buffer);
  return { width, height };
}
