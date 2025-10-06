import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImagePipe implements PipeTransform {
  async transform(image: Express.Multer.File) {
    if (!image) {
      return null;
    }

    try {
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 800 }) // Example: Resize to 800px width
        .jpeg({ quality: 80 }) // Example: Compress to 80% quality
        .toBuffer();

      // Update the file object with the optimized image
      image.buffer = optimizedImageBuffer;
      image.size = optimizedImageBuffer.length; // Update size

      return image;
    } catch (error) {
      throw new BadRequestException('Image processing failed', {
        cause: error,
      });
    }
  }
}
