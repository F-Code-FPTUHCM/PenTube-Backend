import { Body, Controller, Get, Post } from '@nestjs/common';
import { RealIp } from 'nestjs-real-ip';
import { Video } from './videos.schema';
import { VideosService } from './videos.service';

@Controller('/video')
export class VideosController {
    constructor(private readonly videosService: VideosService) {}

    @Get()
    async findAll(@RealIp() ip: string): Promise<Video[]> {
        console.log(ip);
        return await this.videosService.findAll();
    }
    @Post()
    async postVideo(@Body() video: Video): Promise<Video> {
        return await this.videosService.postVideo(video);
    }
}
