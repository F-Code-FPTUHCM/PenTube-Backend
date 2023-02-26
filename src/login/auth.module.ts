import { configYAML } from './../../config/config';
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { CacheModule, Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user';
import { SessionSerializer } from './utils/Serializer';
import { AtStrategy } from './utils/AtStrategy';
import { RtStrategy } from './utils/RtStrategy';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
        ConfigModule,
        JwtModule.register({}),
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: configYAML().redis.host,
            port: configYAML().redis.port,
            user: configYAML().redis.user,
            password: configYAML().redis.password,
            no_ready_check: true,
        }),
    ],
    controllers: [LoginController],
    providers: [
        GoogleStrategy,
        AuthRepository,
        SessionSerializer,
        AuthService,
        AtStrategy,
        RtStrategy,
    ],
    exports: [AuthRepository, SessionSerializer, AuthService],
})
export class AuthModule {}
