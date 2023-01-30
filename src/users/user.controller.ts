import { UpdateUserDto } from './entities/updateUser.dto';
import {
    Controller,
    Get,
    UseGuards,
    Req,
    Post,
    ValidationPipe,
    UsePipes,
    Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('information')
    @UseGuards(AuthGuard('check-token'))
    async getInformationUser(@Req() req) {
        const user = await this.userService.findUser(req.user.sub);
        if (user)
            return {
                code: 200,
                message: 'Success.',
                data: user,
            };
        else
            return {
                code: 404,
                message: 'User not found.',
                data: null,
            };
    }

    @Post('update')
    @UseGuards(AuthGuard('check-token'))
    @UsePipes(new ValidationPipe())
    async updateInformationUser(@Body() newUser: UpdateUserDto) {
        const status = await this.userService.updateUser(newUser);
        if (status)
            return {
                code: 200,
                message: 'Success.',
                data: null,
            };
        else
            return {
                code: 404,
                message: 'Bad request.',
                data: null,
            };
    }

    @Get('histories')
    @UseGuards(AuthGuard('check-token'))
    async getHistoryUser(@Req() req) {
        const histories = await this.userService.getHistoriesUser(req.user.sub);
        if (histories)
            return {
                code: 200,
                message: 'Success.',
                data: histories,
            };
        else
            return {
                code: 404,
                message: 'Bad request.',
                data: null,
            };
    }
}
