import { Body, Controller, Get, Ip, Post } from '@nestjs/common';
import { Video } from './video.schema';
import { VideosService } from './video.service';
import { videoDTO } from './video.dto';

@Controller('/video')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    async findAll(@Ip() ip: string): Promise<Video[]> {
        console.log(ip.split(':').pop());
        return await this.videosService.findAll();
    }
    @Post()
    async postVideo(@Body() video: videoDTO): Promise<Video> {
        return await this.videosService.postVideo(video);
    }
}
