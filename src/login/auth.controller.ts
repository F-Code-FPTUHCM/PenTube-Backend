import { ConfigService } from '@nestjs/config';
import { GoogleLoginGuard } from './utils/Guards';
import {
    Controller,
    Get,
    Post,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Res } from '@nestjs/common/decorators';

@Controller()
export class LoginController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}
    //GET [auth/login/google]
    @Get('login/google')
    @UseGuards(GoogleLoginGuard)
    @HttpCode(HttpStatus.OK)
    handleLoginGoogle() {
        return { msg: 'login google' };
    }

    //GET [auth/google/redirect]
    @Get('google/redirect')
    @UseGuards(GoogleLoginGuard)
    @HttpCode(HttpStatus.OK)
    async handleRedirect(@Req() request, @Res() response) {
        const user = request.user.user;
        const tokens = await this.authService.createToken({ email: user.email, sub: user._id });

        if (request.user.type === 'register')
            response.redirect(
                `${this.configService.get<string>('http.host')}/register?token=${
                    tokens.accessToken
                }&refreshToken=${tokens.refreshToken}`,
            );
        else
            response.redirect(
                `${this.configService.get<string>('http.host')}/?token=${
                    tokens.accessToken
                }&refreshToken=${tokens.refreshToken}`,
            );
        // return {
        //     code: 200,
        //     message: 'Success',
        //     data: {
        //         ...tokens,
        //         type: request.user.type,
        //     },
        // };
    }

    //POST [auth/logout]
    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    logout(@Req() req) {
        const user = req.user;
        const status = this.authService.logout(user.token, user.refreshToken);
        if (status)
            return {
                code: 200,
                message: 'Success',
                data: null,
            };
        else
            throw new BadRequestException('Something bad happened', {
                cause: new Error(),
                description: 'Bad request',
            });
    }

    //POST [auth/refresh-token]
    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req) {
        const user = req.user;
        const tokens = await this.authService.refreshToken(user.sub);
        return {
            code: 200,
            message: 'Success',
            data: tokens,
        };
    }
}
