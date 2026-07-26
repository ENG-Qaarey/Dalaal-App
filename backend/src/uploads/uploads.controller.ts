import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @Permissions(Permission.UPLOAD_IMAGE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload an image' })
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    return this.uploadsService.uploadFile(file, req);
  }

  @Post('video')
  @Permissions(Permission.UPLOAD_IMAGE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a video' })
  async uploadVideo(@UploadedFile() file: any, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('No video file provided');
    }
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only MP4, WebM, MOV, AVI videos are allowed');
    }
    if (file.size > 50 * 1024 * 1024) {
      throw new BadRequestException('Video must be under 50MB');
    }
    return this.uploadsService.uploadFile(file, req);
  }
}
