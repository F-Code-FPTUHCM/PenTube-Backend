import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('only')
    @UseGuards(AuthGuard('check-token'))
    async getInformationUser(@Req() req) {
        const user = await this.userService.findUser(req.user.sub);
        if (user)
            return {
                code: 200,
                message: 'Success',
                data: user,
            };
        else
            return {
                code: 404,
                message: 'User not found.',
                data: null,
            };
    }
}
