import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    async findUser(user_id: string) {
        return this.userRepository.findById(user_id);
    }
}