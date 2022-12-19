import { Module } from '@nestjs/common';
import { VideosModule } from './videos/video.module';
import { ApiController } from './api.Controller';

@Module({
    imports: [VideosModule],
    controllers: [ApiController],
    providers: [],
})
export class ApiModule {}
