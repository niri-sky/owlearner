import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('bucket')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFileInBucket(file);
  }

  @Get('mux/url')
  muxUploadUrl() {
    return this.uploadService.muxUploadUrl();
  }

  @Get('mux/playbackid/:upload_id')
  getPlaybackId(@Param('upload_id') upload_id: string) {
    return this.uploadService.getPlaybackId(upload_id);
  }
}
