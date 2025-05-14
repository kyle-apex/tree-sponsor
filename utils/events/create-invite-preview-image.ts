import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import uploadImage from '../aws/upload-image';

/**
 * Creates an invite preview image by combining the provided image with the invite footer
 *
 * @param imageUrl URL of the image to use for the invite preview
 * @returns URL of the uploaded combined image
 */
export default async function createInvitePreviewImage(imageUrl: string, key: string): Promise<string> {
  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    console.log('response', response);
    const inputImageBuffer = Buffer.from(response.data, 'binary');

    // Resize the input image to 600px wide while maintaining aspect ratio
    const resizedInputImage = await sharp(inputImageBuffer)
      .resize({
        width: 600,
        fit: sharp.fit.contain,
      })
      .toBuffer();

    // Get the dimensions of the resized input image
    const inputImageMetadata = await sharp(resizedInputImage).metadata();
    const inputImageHeight = inputImageMetadata.height || 0;

    // Load the invite-footer.png file
    const footerImagePath = path.join(process.cwd(), 'utils', 'events', 'invite-footer.png');
    const footerImageBuffer = fs.readFileSync(footerImagePath);

    console.log('footerImagePath', footerImagePath);
    // Resize the footer image to 600px wide
    const resizedFooterImage = await sharp(footerImageBuffer)
      .resize({
        width: 600,
        fit: sharp.fit.contain,
      })
      .toBuffer();

    // Get the dimensions of the resized footer image
    const footerImageMetadata = await sharp(resizedFooterImage).metadata();
    const footerImageHeight = footerImageMetadata.height || 0;

    // Calculate the total height
    const totalHeight = inputImageHeight + footerImageHeight;

    // Create a new composite image
    const compositeImage = await sharp({
      create: {
        width: 600,
        height: totalHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: resizedInputImage,
          top: 0,
          left: 0,
        },
        {
          input: resizedFooterImage,
          top: inputImageHeight,
          left: 0,
        },
      ])
      .jpeg()
      .toBuffer();

    // Upload the combined image to AWS S3
    const imageKey = `event-invite/${key}`;
    console.log('before upload');
    const url = await uploadImage(compositeImage, 'image/jpeg', imageKey);

    // Return the URL of the uploaded image
    return url;
  } catch (error) {
    console.error('Error creating invite preview image:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create invite preview image: ${errorMessage}`);
  }
}
