import { UserDocument } from './../Users/user.schema';
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
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
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
        return await this.videoModel.findByIdAndUpdate(video.id, video).exec();
    }

    async upsertVideo(video: VideoDTO): Promise<any> {
        if (video.id) {
            const result = await this.updateVideo(video);
            if (!result) {
                throw new ResponseException(404, 'Not found Id');
            }
            return result;
        }
        return await this.postVideo(video);
    }

    async updateView(id: string, viewDTO: ViewDTO): Promise<any> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ResponseException(400, 'Invalid Id');
        }
        // find existing video and view
        const video = await this.videoModel.findById(id);
        let newView = await this.viewModel.findOne({ userId: viewDTO.userId });
        const user = await this.userModel.findOne({ _id: viewDTO.userId });

        // check if exists
        if (!user) {
            throw new ResponseException(404, 'User not found');
        }
        if (!video) {
            throw new ResponseException(404, 'Video not found');
        }
        if (!newView) {
            // create new view if the person not viewed the video yet
            newView = new this.viewModel(viewDTO);
            newView.count = 0;
        } else {
            await this.videoModel.updateOne(viewDTO);
        }
        if (viewDTO.frameWatched / video.totalFrame > 0.9) {
            newView.count++;
        }
        if (viewDTO.frameWatched === video.totalFrame) {
            newView.frameWatched = 0;
        }
        // push the new view to views list of the video
        video.views.push(newView._id.toString());
        video.totalViews++;
        newView.save();
        return await video.save();
    }
}
