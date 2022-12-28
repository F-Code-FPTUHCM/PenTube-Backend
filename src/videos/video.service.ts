import { UserDTO } from './../Users/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Query } from 'mongoose';
import { Video, VideoDocument, ViewDocument } from './video.schema';
import { VideoDTO, ViewDTO } from './video.dto';
import { ResponseException } from './../Exception/ResponseException';

@Injectable()
export class VideoService {
    constructor(
        @InjectModel('Videos') private readonly videoModel: Model<VideoDocument>,
        @InjectModel('Views') private readonly viewModel: Model<ViewDocument>,
    ) {}

    async findAll(): Promise<Video[]> {
        return await this.videoModel.find().exec();
    }
    async getOne(id: string): Promise<Video> {
        return await this.videoModel.findById(id).exec();
    }
    async postVideo(video: VideoDTO): Promise<Video> {
        const newVideo = new this.videoModel(video);
        return await newVideo.save();
    }
    async updateVideo(video: VideoDTO): Promise<any> {
        if (!video.id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ResponseException(400, 'Invalid Id');
        }
        return await this.videoModel.findByIdAndUpdate({ _id: video.id }, video).exec();
    }
    async upsertVideo(video: VideoDTO): Promise<any> {
        let result = null;
        if (video.id) {
            result = await this.updateVideo(video);
            if (!result) {
                throw new ResponseException(404, 'Not found Id');
            }
            return result;
        }
        result = await this.postVideo(video);
        return result;
    }
    async updateView(id: string, viewDTO: ViewDTO): Promise<any> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ResponseException(400, 'Invalid Id');
        }
        // find existing video and view
        const video = await this.videoModel.findById(id);
        let newView = await this.viewModel.findOne({ userId: viewDTO.userId });

        if (!video) {
            throw new ResponseException(404, 'Video not found');
        }
        if (!newView) {
            // create new view if the person not viewed the video yet
            newView = new this.viewModel(viewDTO);
        } else {
            await newView.validate().catch(err => {
                throw new ResponseException(400, err);
            });
            await newView.updateOne(viewDTO);
        }
        // push the new view to views list of the video
        video.views.push(newView._id.toString());
        newView.save();
        return await video.save();
    }
}
