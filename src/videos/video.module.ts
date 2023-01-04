import { UsersSchema } from './../Users/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema, ViewVideoSchema, LocationSchema } from './video.schema';
import { VideoService } from './video.service';
import { VideosController } from './video.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Videos', schema: VideoSchema },
            { name: 'Views', schema: ViewVideoSchema },
            { name: 'Users', schema: UsersSchema },
            { name: 'Locations', schema: LocationSchema },
        ]),
    ],
    controllers: [VideosController],
    providers: [VideoService],
})
export class VideoModule {}
