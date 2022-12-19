import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './videos.schema';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Videos', schema: VideoSchema }])],
    controllers: [VideosController],
    providers: [VideosService],
})
export class VideosModule {}
