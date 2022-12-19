import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './video.schema';
import { VideosService } from './video.service';
import { VideosController } from './video.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Videos', schema: VideoSchema }])],
    controllers: [VideosController],
    providers: [VideosService],
})
export class VideosModule {}
