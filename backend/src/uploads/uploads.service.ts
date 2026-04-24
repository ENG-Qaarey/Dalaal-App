import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  async uploadFile(file: any, req: any) {
    if (!file?.buffer) {
      throw new InternalServerErrorException('Invalid upload payload');
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const originalExt = extname(file.originalname || '').toLowerCase();
    const safeExt = originalExt || '.jpg';
    const filename = `${uuidv4()}${safeExt}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, file.buffer);

    const protocol =
      req?.headers?.['x-forwarded-proto']?.toString().split(',')[0]?.trim() || req?.protocol || 'http';
    const host = req?.headers?.host;
    const url = `${protocol}://${host}/uploads/${filename}`;

    return {
      url,
      filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
