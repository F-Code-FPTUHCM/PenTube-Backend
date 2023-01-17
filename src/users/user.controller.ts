import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    @Get('/:id')
    // @UseGuards(AuthGuard('jwt'))
    async getInformationUser(@Req() req) {
        const user = await this.userService.findUser(req.params.id);
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
