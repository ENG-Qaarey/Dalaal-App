import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadsService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: any) {
    return this.cloudinaryService.uploadImage(file);
  }
}
