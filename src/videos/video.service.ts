import { forwardRef } from '@nestjs/common/utils';
import { UserDocument } from '../Users/entities/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Query } from 'mongoose';
import { LocationDocument, Video, VideoDocument, ViewDocument } from './video.schema';
import { VideoDTO, ViewDTO, LocationDTO } from './video.dto';
// import { ResponseException } from './../Exception/ResponseException';
import { InjectGeoIP2 } from 'nestjs-geoip2';
import { ReaderModel } from '@maxmind/geoip2-node';
import { ResponseException } from '../Exception/ResponseException';
import { SearchService } from '../search/search.service';
@Injectable()
export class VideoService {
    constructor(
        @InjectModel('Videos') private readonly videoModel: Model<VideoDocument>,
        @InjectModel('Views') private readonly viewModel: Model<ViewDocument>,
        @InjectModel('Users') private readonly userModel: Model<UserDocument>,
        @InjectModel('Locations') private readonly locationModel: Model<LocationDocument>,
        @InjectGeoIP2() private readonly geoIPReaderModal: ReaderModel,
        private readonly searchService: SearchService,
    ) {}

    async findAll(): Promise<Video[]> {
        const videos: Video[] = await this.videoModel.find().populate('channel').exec();
        videos.filter(video => video.key === null);
        return videos;
    }

    async getOne(id: string, ip: string): Promise<Video> {
        const video = await this.videoModel
            .findById(id)
            .populate('channel')
            .populate('views')
            .exec();
        if (!video) {
            throw new ResponseException(404, 'Not found video');
        }
        video.views = video.views.filter(view => view.ip === ip);
        return video;
    }

    async postVideo(video: VideoDTO): Promise<boolean> {
        const newVideo = new this.videoModel(video);
        const insertToTrie = await this.searchService.buildTrieByTitle(
            newVideo.title,
            newVideo._id.toString(),
        );
        return (await newVideo.save()) && insertToTrie;
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

    async updateLocationView(ip: string, locations: Record<string, any>[]): Promise<any> {
        const city = this.geoIPReaderModal.city(ip);

        if (!city) {
            throw new ResponseException(404, 'Not found City');
        }
        const locationDTO = new LocationDTO(city);
        let currentLocation = await locations.find(l => l.code === locationDTO.code);
        // push the new location to view
        if (!currentLocation) {
            // create in location collection
            currentLocation = await this.locationModel.findOne({ code: locationDTO.code }).exec();
            if (!currentLocation) {
                currentLocation = await this.locationModel.create(locationDTO);
            }
            locations.push(currentLocation);
        }
        // Find existed city in the location and update total view of it
        const existedCity = currentLocation.city.find(
            item => item.name === locationDTO.city[0].name,
        );
        if (existedCity) {
            existedCity.totalView++;
        } else {
            currentLocation.city.push(locationDTO.city[0]);
            currentLocation.city[0].totalView = 1;
        }

        currentLocation.totalView++;
        return await currentLocation.save();
    }
    async updateView(viewDTO: ViewDTO, ip: string): Promise<any> {
        // find existing video and view
        const video = await this.videoModel.findById(viewDTO.videoId).exec();
        let newView = await this.viewModel
            .findOne({
                ip: ip,
                videoId: viewDTO.videoId,
            })
            .populate('location')
            .exec();

        // check if exists video
        if (!video) {
            throw new ResponseException(404, 'Video not found');
        }
        if (newView && newView.userId) {
            viewDTO.userId = newView.userId;
        }
        // if user not logged in, create a fake userId to fix the error userId is null
        if (!viewDTO.userId) {
            viewDTO.userId = new mongoose.Types.ObjectId().toString();
        }
        // create new view if the person not viewed the video yet
        if (!newView) {
            viewDTO.ip = ip;
            newView = new this.viewModel(viewDTO);
            newView.count = 0;
        } else {
            await this.viewModel.updateOne(viewDTO).exec();
        }
        // Update view by check the number of frame viewed
        if (viewDTO.frameWatched / video.totalFrame > 0.9) {
            //update location view by Ip
            await this.updateLocationView(ip, newView.location);
            //accept the view
            newView.currentFrame = 0;
            newView.count++;
            newView.frameWatched = 0;
            if (!video.views.find(view => view === newView.id)) {
                video.views.push(newView.id);
            }
        }
        video.totalViews++;

        //save to database
        await newView.save();
        return await video.save();
    }
    async updateLike(videoId: string, userId: string) {
        const video = await this.videoModel.findById(videoId);
        const user = await this.userModel.findById(userId);
        if (!video) {
            throw new ResponseException(404, 'Video not found');
        }
        if (!user) {
            throw new ResponseException(404, 'User not found');
        }
        video.likes.push(user.id);
        return await video.save();
    }
}
