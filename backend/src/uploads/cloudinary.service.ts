import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: any) {
    this.logger.log('Uploading image to Cloudinary (simulated)');
    return {
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      publicId: 'sample_id',
    };
  }

  async deleteImage(publicId: string) {
    this.logger.log(`Deleting image ${publicId} from Cloudinary (simulated)`);
    return { result: 'ok' };
  }
}
