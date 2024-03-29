import { AppConfig } from './../../config/config.module';
import { ConfigModule } from '@nestjs/config';
import { CheckToken } from '../utils/check-token';
import { VideoModule } from './video.module';
import { forwardRef } from '@nestjs/common/utils';
import { AuthModule } from './../login/auth.module';
import { SearchModule } from './../search/search.module';
import { geoIPConfig } from './../../config/geoIP/config';
import { GeoIP2Module } from 'nestjs-geoip2';
import { configYAML } from './../../config/config';
import { UsersSchema } from '../Users/entities/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema, ViewVideoSchema, LocationSchema } from './video.schema';
import { ResponseModal } from './../Response/response.modal';
import { Test } from '@nestjs/testing';
import { VideoService } from './video.service';
import { VideosController } from './video.controller';

describe('VideoController', () => {
    let videoController: VideosController;
    let videoService: VideoService;
    beforeEach(async () => {
        // Test class has createTestingModule can take a module metadata object as it argument
        // (the same as object passed to the @Module decorator)
        // this return a testing module instance
        const moduleRef = await Test.createTestingModule({
            controllers: [VideosController],
            providers: [VideoService, CheckToken],
            imports: [
                MongooseModule.forFeature([
                    { name: 'Videos', schema: VideoSchema },
                    { name: 'Views', schema: ViewVideoSchema },
                    { name: 'Users', schema: UsersSchema },
                    { name: 'Locations', schema: LocationSchema },
                ]),
                SearchModule,
                VideoModule,
                AuthModule,
                AppConfig,
                ConfigModule.forRoot(),
                MongooseModule.forRoot(configYAML().db.mongodb.host),
                GeoIP2Module.forRoot(geoIPConfig),
            ],
        }).compile();

        videoService = moduleRef.get<VideoService>(VideoService);
        videoController = moduleRef.get<VideosController>(VideosController);
    });

    describe('findAll', () => {
        it('should return an array of videos', async () => {
            const videos = await videoService.findAll();
            const result = new ResponseModal<Video[]>(200, 'Success', videos);
            jest.spyOn(videoService, 'findAll').mockImplementation(async () => await videos);
            return await expect(videoController.findAll()).resolves.toStrictEqual(result);
        });
    });

    describe('findOne', () => {
        it('should return an video', async () => {
            const id = '63b024e94a1446e519c1a49f';
            const video = await videoService.getOne(id);
            const result = new ResponseModal<Video>(200, 'Success', video);
            jest.spyOn(videoService, 'getOne').mockImplementation(async () => video);
            return await expect(videoController.findOne(id)).resolves.toStrictEqual(result);
        });
    });
});
