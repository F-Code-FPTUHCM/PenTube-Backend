import { UserSchema } from './entities/user';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UsersService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UsersService, UserRepository],
})
export class UserModule {}
