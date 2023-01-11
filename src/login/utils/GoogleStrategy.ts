import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import configYAML from 'config/config';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private configService: ConfigService) {
        super({
            clientID: configService.get<string>('google.client_id'),
            clientSecret: configService.get<string>('google.client_secret'),
            callbackURL: configService.get<string>('google.redirect_uri'),
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const data = await this.authService.validateUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatarUrl: profile._json.picture,
        });
        return data;
    }
}
