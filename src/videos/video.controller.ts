import { Body, Controller, Get, Ip, Post, Put, ValidationPipe } from '@nestjs/common';
import { Video } from './video.schema';
import { VideoService } from './video.service';
import { VideoDTO, ViewDTO } from './video.dto';
import { ResponseModal } from './../Response/response.modal';
import { Param, UsePipes } from '@nestjs/common/decorators';

@Controller('/video')
export class VideosController {
    constructor(private readonly videoService: VideoService) {}

    @Get()
    async findAll(): Promise<ResponseModal<Video[]>> {
        const result = await this.videoService.findAll();
        return new ResponseModal<Video[]>(200, 'Success', result);
    }
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseModal<Video>> {
        const result = await this.videoService.getOne(id);
        return new ResponseModal<Video>(200, 'Success', result);
    }
    @Post()
    async upsert(@Body() video: VideoDTO): Promise<ResponseModal> {
        await this.videoService.upsertVideo(video);
        return new ResponseModal(200, 'Success');
    }
    @Put(':id')
    async updateView(@Param('id') id: string, @Body() viewDTO: ViewDTO): Promise<ResponseModal> {
        await this.videoService.updateView(id, viewDTO);
        return new ResponseModal(200, 'Success');
    }
}
