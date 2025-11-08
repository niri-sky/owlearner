import Mux from '@mux/mux-node';
import { APIPromise } from '@mux/mux-node/core';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MuxService {
  private readonly muxClient: Mux;

  constructor() {
    this.muxClient = new Mux();
  }

  createUploadUrl(
    body: Mux.Video.Uploads.UploadCreateParams,
    options?: Mux.RequestOptions<unknown>,
  ): APIPromise<Mux.Video.Uploads.Upload> {
    return this.muxClient.video.uploads.create(body, options);
  }

  async getPlaybackId(upload_id: string) {
    const listArr = await this.muxClient.video.assets.list({ upload_id });
    if (listArr.data.length < 0)
      throw new InternalServerErrorException('Something went wrong');

    const playbackId = listArr.data.at(0).playback_ids.at(0).id;
    return playbackId;
  }
  async getVideoAssetsInfo(upload_id: string) {
    const listArr = await this.muxClient.video.assets.list({ upload_id });
    if (listArr.data.length < 0)
      throw new InternalServerErrorException('Something went wrong');

    const info = listArr.data.at(0);
    return info;
  }
}
