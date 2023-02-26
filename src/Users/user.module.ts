import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { CheckToken } from './../../src/utils/check-token';
import { AuthService } from './../../src/login/auth.service';
import { AuthRepository } from './../../src/login/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import configYAML from './../../config/config';
import { UsersSchema } from './entities/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UsersSchema,
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
    controllers: [UserController],
    providers: [UserService, UserRepository, CheckToken, AuthService, AuthRepository],
})
export class UserModule {}
