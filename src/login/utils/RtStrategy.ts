import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import mongoose from 'mongoose';
import configYAML from 'config/config';

type JwtPayload = {
    email: string;
    sub: mongoose.Types.ObjectId;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configYAML().token.secret_rt,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        const statusRefreshToken = await this.authService.checkToken(refreshToken);
        if (statusRefreshToken) throw new ForbiddenException('Access denied');
        else return { ...payload };
    }
}
