import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import mongoose from 'mongoose';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import configYAML from 'config/config';

type JwtPayload = {
    email: string;
    sub: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configYAML().token.secret_at,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        try {
            const token = req.get('authorization').replace('Bearer', '').trim();
            const refreshToken = req.get('refreshToken').replace('Bearer', '').trim();
            const statusToken = await this.authService.checkToken(token);
            const statusRefreshToken = await this.authService.checkToken(refreshToken);
            if (statusToken || statusRefreshToken) throw new ForbiddenException('Access denied');
            else
                return {
                    ...payload,
                    token,
                    refreshToken,
                };
        } catch (error) {
            throw new ForbiddenException('Access denied');
        }
    }
}
