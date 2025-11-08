import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { MuxService } from 'src/configs/mux/mux.service';
import { UploadController } from './upload.controller';

@Module({
  providers: [UploadService, MuxService],
  controllers: [UploadController],
})
export class UploadModule {}
