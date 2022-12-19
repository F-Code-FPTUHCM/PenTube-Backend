import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';
import { videoDTO } from './video.dto';

@Injectable()
export class VideosService {
    constructor(@InjectModel('Videos') private readonly videosModel: Model<VideoDocument>) {}

    async findAll(): Promise<Video[]> {
        return await this.videosModel.find().exec();
    }
    async postVideo(video: videoDTO): Promise<Video> {
        const newVideo = new this.videosModel(video);
        return await newVideo.save();
    }
}
