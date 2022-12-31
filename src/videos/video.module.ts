import { UserSchema } from './../Users/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema, ViewVideoSchema } from './video.schema';
import { VideoService } from './video.service';
import { VideosController } from './video.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Videos', schema: VideoSchema },
            { name: 'Views', schema: ViewVideoSchema },
            { name: 'User', schema: UserSchema },
        ]),
    ],
    controllers: [VideosController],
    providers: [VideoService],
})
export class VideosModule {}
