import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    @Get('/:id')
    // @UseGuards(AuthGuard('jwt'))
    getInformationUser(@Req() req) {
        return { id: req.params.id };
    }
}
