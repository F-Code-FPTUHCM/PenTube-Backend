import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDetails } from './entities/User';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
    ) {}

    async findById(id: string): Promise<User> {
        console.log(await this.userModel.findById(id));
        return this.userModel.findById(id);
    }

    async findOne(options: any): Promise<User> {
        return this.userModel.findOne(options);
    }

    async addOne(user: UserDetails): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async updateById(id: mongoose.Types.ObjectId, value: any) {
        try {
            await this.userModel.updateMany({ _id: id }, value);
            return true;
        } catch (error) {
            return false;
        }
    }
}
