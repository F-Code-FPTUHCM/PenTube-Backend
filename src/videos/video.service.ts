import { forwardRef } from '@nestjs/common/utils';
import { UserDocument } from '../Users/entities/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Query } from 'mongoose';
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

    async getOne(id: string): Promise<Video> {
        const video = await this.videoModel.findById(id).populate('channel').exec();
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
        const user = await this.userModel.findById(viewDTO.userId).exec();
        let newView = await this.viewModel
            .findOne({
                userId: viewDTO.userId,
                videoId: viewDTO.videoId,
            })
            .populate('location')
            .exec();

        // check if exists
        if (!user) {
            // throw new ResponseException(404, 'User not found');
        }
        if (!video) {
            // throw new ResponseException(404, 'Video not found');
        }

        // create new view if the person not viewed the video yet
        if (!newView) {
            newView = new this.viewModel(viewDTO);
            newView.count = 0;
        } else {
            await this.videoModel.updateOne(viewDTO).exec();
        }
        // Update view by check the number of frame viewed
        if (viewDTO.frameWatched / video.totalFrame > 0.9 && !newView.isWatched) {
            //update location view by Ip
            await this.updateLocationView(ip, newView.location);
            //accept the view
            newView.count++;
            newView.isWatched = true;
        }
        // reset frame watched when it is full
        if (viewDTO.frameWatched === video.totalFrame) {
            newView.frameWatched = 0;
            newView.isWatched = false;
        }
        video.totalViews++;

        //save to database
        await newView.save();
        return await video.save();
    }
    async updateLike(videoId: string, userId: string) {
        console.log(videoId, userId);
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
