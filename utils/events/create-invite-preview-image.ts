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
 * @param key Unique identifier for the image
 * @param headshotUrl Optional URL of a headshot image to overlay on the invite
 * @returns URL of the uploaded combined image
 */
export default async function createInvitePreviewImage(imageUrl: string, key: string, headshotUrl?: string): Promise<string> {
  console.log('Starting invite preview image creation');
  console.log('Image URL:', imageUrl);
  console.log('Headshot URL:', headshotUrl);

  try {
    // Step 1: Fetch and process the main image
    console.log('Fetching main image...');
    let inputImageBuffer;
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      inputImageBuffer = Buffer.from(response.data);
    } catch (fetchError) {
      console.error('Error fetching main image:', fetchError);
      throw new Error('Failed to fetch main image');
    }

    // Step 2: Resize the main image
    console.log('Resizing main image...');
    let resizedInputImage;
    try {
      resizedInputImage = await sharp(inputImageBuffer)
        .resize({
          width: 600,
          fit: sharp.fit.contain,
        })
        .toBuffer();
    } catch (resizeError) {
      console.error('Error resizing main image:', resizeError);
      throw new Error('Failed to resize main image');
    }

    // Step 3: Get dimensions of resized image
    console.log('Getting main image dimensions...');
    let inputImageHeight = 0;
    try {
      const metadata = await sharp(resizedInputImage).metadata();
      inputImageHeight = metadata.height || 0;
      console.log('Main image height:', inputImageHeight);
    } catch (metadataError) {
      console.error('Error getting main image metadata:', metadataError);
      throw new Error('Failed to get main image dimensions');
    }

    // Step 4: Load and process the footer image
    console.log('Loading footer image...');
    let resizedFooterImage;
    let footerImageHeight = 0;
    try {
      const footerImagePath = path.join(process.cwd(), 'utils', 'events', 'invite-footer.png');
      const footerImageBuffer = fs.readFileSync(footerImagePath);

      resizedFooterImage = await sharp(footerImageBuffer)
        .resize({
          width: 600,
          fit: sharp.fit.contain,
        })
        .toBuffer();

      const footerMetadata = await sharp(resizedFooterImage).metadata();
      footerImageHeight = footerMetadata.height || 0;
      console.log('Footer image height:', footerImageHeight);
    } catch (footerError) {
      console.error('Error processing footer image:', footerError);
      throw new Error('Failed to process footer image');
    }

    // Calculate total height
    const totalHeight = inputImageHeight + footerImageHeight;
    console.log('Total image height:', totalHeight);

    // Prepare composite inputs (without headshot for now)
    const compositeInputs = [
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
    ];

    // Step 5: Process headshot if provided (but make it optional)
    let hasHeadshot = false;
    if (headshotUrl) {
      try {
        console.log('Processing headshot...');
        const headshotResponse = await axios.get(headshotUrl, { responseType: 'arraybuffer' });
        const headshotBuffer = Buffer.from(headshotResponse.data);

        // Check if we can process this image
        try {
          const metadata = await sharp(headshotBuffer).metadata();
          console.log('Headshot format:', metadata.format);

          if (!metadata.format) {
            console.warn('Unknown headshot format, skipping headshot');
            throw new Error('Unknown headshot format');
          }

          // Size for the headshot
          const borderWidth = 4;
          const headshotSize = 220;
          const borderSize = headshotSize + borderWidth * 2; // 2px border on each side

          // Position calculations
          const headshotLeft = 600 - borderSize - 20;
          const headshotTop = totalHeight - borderSize - 20;

          // Create a circular headshot using a simpler approach
          console.log('Creating circular headshot...');

          // First create a circular mask using a simple approach
          const circleMask = await sharp({
            create: {
              width: headshotSize,
              height: headshotSize,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          })
            .composite([
              {
                input: Buffer.from(
                  `<svg><circle cx="${headshotSize / 2}" cy="${headshotSize / 2}" r="${headshotSize / 2}" fill="white"/></svg>`,
                ),
              },
            ])
            .png()
            .toBuffer();

          // Apply the mask to the headshot
          const circularHeadshot = await sharp(headshotBuffer)
            .resize({
              width: headshotSize,
              height: headshotSize,
              fit: sharp.fit.cover,
              position: 'centre',
            })
            .png() // Convert to PNG for consistency
            .composite([
              {
                input: circleMask,
                blend: 'dest-in',
              },
            ])
            .toBuffer();

          // Create a white circle border (transparent background with white ring)
          const whiteBorder = await sharp({
            create: {
              width: borderSize,
              height: borderSize,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
            },
          })
            .composite([
              {
                input: Buffer.from(
                  `<svg>
                    <circle cx="${borderSize / 2}" cy="${borderSize / 2}" r="${borderSize / 2}" fill="white"/>
                    <circle cx="${borderSize / 2}" cy="${borderSize / 2}" r="${headshotSize / 2}" fill="transparent"/>
                  </svg>`,
                ),
              },
            ])
            .png()
            .toBuffer();

          // Add the border and headshot to composite inputs
          compositeInputs.push({
            input: whiteBorder,
            top: headshotTop,
            left: headshotLeft,
          });

          compositeInputs.push({
            input: circularHeadshot,
            top: headshotTop + borderWidth, // 2px offset for the border
            left: headshotLeft + borderWidth, // 2px offset for the border
          });

          hasHeadshot = true;
          console.log('Headshot processed successfully');
        } catch (processingError) {
          console.warn('Skipping headshot due to processing error:', processingError);
          // Continue without the headshot
        }
      } catch (headshotError) {
        console.warn('Skipping headshot due to fetch error:', headshotError);
        // Continue without the headshot
      }
    }

    // Step 6: Create the final composite image
    console.log('Creating final composite image...');
    let compositeImage;
    try {
      compositeImage = await sharp({
        create: {
          width: 600,
          height: totalHeight,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite(compositeInputs)
        .jpeg()
        .toBuffer();

      console.log('Composite image created successfully');
    } catch (compositeError) {
      console.error('Error creating composite image:', compositeError);
      throw new Error('Failed to create composite image');
    }

    // Step 7: Upload the image
    console.log('Uploading image to S3...');
    const imageKey = `event-invite/${key}`;
    const url = await uploadImage(compositeImage, 'image/jpeg', imageKey);

    console.log('Image uploaded successfully:', url);
    console.log('Headshot included:', hasHeadshot);

    return url;
  } catch (error) {
    console.error('Error creating invite preview image:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create invite preview image: ${errorMessage}`);
  }
}
