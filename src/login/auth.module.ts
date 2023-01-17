import { ConfigModule } from '@nestjs/config';
import { UserRepository } from './auth.repository';
import { CacheModule, Module } from '@nestjs/common';
import { LoginController } from './auth.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/User';
import { SessionSerializer } from './utils/Serializer';
import { AtStrategy } from './utils/AtStrategy';
import { RtStrategy } from './utils/RtStrategy';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import configYAML from 'config/config';

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
            // isGlobal: true,
            store: redisStore,
            host: configYAML().redis.host,
            port: configYAML().redis.post,
            // user: configYAML().redis.user,
            // password: configYAML().redis.password,
        }),
    ],
    controllers: [LoginController],
    providers: [
        GoogleStrategy,
        UserRepository,
        SessionSerializer,
        AuthService,
        AtStrategy,
        RtStrategy,
    ],
})
export class AuthModule {}
