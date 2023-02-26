import { configYAML } from './../../config/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../login/auth.service';

type JwtPayload = {
    email: string;
    sub: string;
};

@Injectable()
export class CheckToken extends PassportStrategy(Strategy, 'check-token') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configYAML().token.secret_at,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const token = req.get('authorization').replace('Bearer', '').trim();
        const statusToken = await this.authService.checkToken(token);
        if (statusToken) throw new ForbiddenException('Access denied. Please re-login.');
        return {
            ...payload,
            token,
        };
    }
}
