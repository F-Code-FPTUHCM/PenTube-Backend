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
        return this.userModel.findById(id);
    }

    async findOne(options: any): Promise<User> {
        return this.userModel.findOne(options);
    }

    async addOne(user: UserDetails): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async updateById(id: string, value: any) {
        try {
            await this.userModel.updateOne({ _id: id }, value);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
