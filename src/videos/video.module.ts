import { configYAML } from 'config/config';
import { SearchService } from 'src/search/search.service';
import * as redisStore from 'cache-manager-redis-store';
import { SearchModule } from './../search/search.module';
import { AuthModule } from './../login/auth.module';
import { CheckToken } from './../utils/check-token';
import { UsersSchema } from '../Users/entities/user.schema';
import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema, ViewVideoSchema, LocationSchema, ChannelSchema } from './video.schema';
import { VideoService } from './video.service';
import { VideosController } from './video.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Videos', schema: VideoSchema },
            { name: 'Views', schema: ViewVideoSchema },
            { name: 'Users', schema: UsersSchema },
            { name: 'Locations', schema: LocationSchema },
            { name: 'Channels', schema: ChannelSchema },
        ]),
        AuthModule,
        SearchModule,
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: configYAML().redis.host,
            port: configYAML().redis.post,
            user: configYAML().redis.user,
            password: configYAML().redis.password,
        }),
    ],
    exports: [VideoService],
    controllers: [VideosController],
    providers: [VideoService, CheckToken],
})
export class VideoModule {}
