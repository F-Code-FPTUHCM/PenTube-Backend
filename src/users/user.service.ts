import { UpdateUserDto } from './entities/updateUser.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findUser(user_id: string) {
        return this.userRepository.findById(user_id);
    }

    async getHistoriesUser(user_id: string) {
        const user = await this.userRepository.findById(user_id);
        return user.histories;
    }

    async updateUser(newUser: UpdateUserDto) {
        return this.userRepository.updateById(newUser._id, {
            name: newUser.name,
            avatarUrl: newUser.avatarUrl,
        });
    }
}
