import { AuthRepository } from './auth.repository';
import { Injectable, ForbiddenException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { UserDetails } from './entities/User';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './entities/token.type';
import mongoose from 'mongoose';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async validateUser(details: UserDetails) {
        const user = await this.authRepository.findOne({ email: details.email });
        if (user) return { user, type: 'login' };
        const newUser = await this.authRepository.addOne(details);
        return { user: newUser, type: 'register' };
    }

    async findUser(user_id: string) {
        return this.authRepository.findById(user_id);
    }

    async createToken(user: { email: string; sub: string }): Promise<Tokens> {
        const accessToken = await this.jwtService.signAsync(user, {
            secret: this.configService.get<string>('token.secret_at'),
            expiresIn: 60 * 60 * 2,
        });
        const refreshToken = await this.jwtService.signAsync(user, {
            secret: this.configService.get<string>('token.secret_rt'),
            expiresIn: 60 * 60 * 2,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(token: string, refreshToken: string) {
        //expired after 2h
        await this.cacheManager.set(token, 'true', { ttl: 60 * 60 * 2 });
        //expired after 3d
        await this.cacheManager.set(refreshToken, 'true', { ttl: 60 * 60 * 24 * 3 });
        return true;
    }

    async refreshToken(id: string) {
        const user = await this.authRepository.findById(id);
        if (!user) throw new ForbiddenException('Access denied');

        const tokens = await this.createToken({ email: user.email, sub: user._id });
        return tokens;
    }

    async checkToken(token: string) {
        const value = await this.cacheManager.get(token);
        return value === 'true';
    }
}
