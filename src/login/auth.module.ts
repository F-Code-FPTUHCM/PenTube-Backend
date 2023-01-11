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

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
        JwtModule.register({}),
        CacheModule.register({
            // isGlobal: true,
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            // user: process.env.REDIS_USER,
            // password: process.env.REDIS_PASSWORD,
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
