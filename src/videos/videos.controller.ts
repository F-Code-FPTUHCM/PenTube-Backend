import { Controller, Get } from '@nestjs/common';
import { Video } from './videos.schema';
import { VideosService } from './videos.service';

@Controller('/video')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    async findAll(): Promise<Video[]> {
        return await this.videosService.findAll();
    }
}
