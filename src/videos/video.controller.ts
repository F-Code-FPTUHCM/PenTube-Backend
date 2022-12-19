import {
    Body,
    Controller,
    Get,
    Ip,
    Post,
    HttpException,
    HttpStatus,
    UseFilters,
} from '@nestjs/common';
import { Video } from './video.schema';
import { VideosService } from './video.service';
import { videoDTO } from './video.dto';
import { HttpExceptionFilter } from './../Exception/exception.filter';
import { BadRequestException } from './../Exception/BadReqestException';

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
        try {
            return await this.videosService.postVideo(video);
        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.message);
            }
        }
    }
}
