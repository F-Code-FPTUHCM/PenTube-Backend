import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    async findUser(user_id: mongoose.Types.ObjectId) {
        return this.userRepository.findById(user_id);
    }
}
