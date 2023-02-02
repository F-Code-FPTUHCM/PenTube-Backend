import { AuthModule } from './../login/auth.module';
import { CheckToken } from './../utils/check-token';
import { UsersSchema } from '../users/entities/user.schema';
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
        AuthModule,
    ],
    controllers: [VideosController],
    providers: [VideoService, CheckToken],
})
export class VideoModule {}
