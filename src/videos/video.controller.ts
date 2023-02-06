import { ConfigService } from '@nestjs/config';
import { configYAML } from './../../config/config';
import { CheckToken } from './../utils/check-token';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './../login/utils/Role.Decorator';
import { RoleGuard } from './../login/utils/Guards';
import { DEMO_IP } from './demoIP';
import { Body, Controller, Get, Ip, Post, Put, ValidationPipe } from '@nestjs/common';
import { Video } from './video.schema';
import { VideoService } from './video.service';
import { VideoDTO, ViewDTO } from './video.dto';
import { ResponseModal } from './../Response/response.modal';
import { Param, Req, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { RealIP } from 'nestjs-real-ip';

@Controller()
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
    @UseGuards(AuthGuard('check-token'))
    async upsert(@Body() video: VideoDTO): Promise<ResponseModal> {
        await this.videoService.upsertVideo(video);
        return new ResponseModal(200, 'Success');
    }

    @Put('/view')
    @UseGuards(AuthGuard('check-token'))
    async updateView(@Body() viewDTO: ViewDTO, @RealIP() ip: string): Promise<ResponseModal> {
        const realIp = ip.split(':')[3];
        // TODO: change to real ip when public
        await this.videoService.updateView(viewDTO, DEMO_IP.GB);
        return new ResponseModal(200, 'Success');
    }
    @Post('/like')
    @UseGuards(AuthGuard('check-token'))
    async updateLike(
        @Body('videoId') videoId: string,
        @Body('userId') userId: string,
        @RealIP() ip: string,
    ): Promise<ResponseModal> {
        const realIp = ip.split(':')[3];
        console.log(userId, videoId);
        const result = await this.videoService.updateLike(videoId, userId);
        return new ResponseModal(200, 'Success');
    }
}
