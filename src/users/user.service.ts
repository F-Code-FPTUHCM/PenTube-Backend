import { UpdateUserDto } from './entities/updateUser.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateHistoriesDto } from './entities/updateHistories.dto';

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

    async updateHistoriesUser({ userId, videoId }: UpdateHistoriesDto) {
        const user = await this.userRepository.findById(userId);
        const histories = user.histories;
        let newHistories = [];
        let ok = true;
        if (histories.length > 0)
            newHistories = histories.map(history => {
                if (history.videoId.toString() === videoId) {
                    ok = false;
                    return {
                        videoId,
                        lastVisitedAt: Date.now(),
                    };
                } else return history;
            });
        if (ok)
            newHistories.push({
                videoId,
                lastVisitedAt: Date.now(),
            });
        return this.userRepository.updateById(userId, { histories: newHistories });
    }
}
