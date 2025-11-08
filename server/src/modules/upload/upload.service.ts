import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MuxService } from 'src/configs/mux/mux.service';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private AWS_BUCKET = process.env.AWS_BUCKET;
  private client: S3Client;
  constructor(private readonly muxService: MuxService) {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  async muxUploadUrl() {
    const id = randomUUID();
    const upload = await this.muxService.createUploadUrl({
      cors_origin: '*',
      new_asset_settings: {
        passthrough: id,
        playback_policy: ['public'],
        encoding_tier: 'baseline',
      },
    });

    return {
      id: upload.id,
      url: upload.url,
    };
  }
  async getPlaybackId(upload_id: string) {
    const response = await this.muxService.getVideoAssetsInfo(upload_id);

    const playbackId = response.playback_ids.at(0).id;
    return {
      playbackId,
    };
  }

  async uploadFileInBucket(file: Express.Multer.File) {
    const fileKey = Date.now().toString() + '-' + file.originalname;
    try {
      const res = await this.client.send(
        new PutObjectCommand({
          Bucket: this.AWS_BUCKET,
          Body: file.buffer,
          Key: fileKey,
          ContentType: file.mimetype,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        }),
      );
      const location = `https://${this.AWS_BUCKET}.s3.amazonaws.com/${fileKey}`;

      return { location, status: 'Success' };
    } catch (error) {
      console.log(error, 'Error occured');
      throw new InternalServerErrorException('Error uploading file');
    }
  }

  async deleteFileFromBucket() {}
}
