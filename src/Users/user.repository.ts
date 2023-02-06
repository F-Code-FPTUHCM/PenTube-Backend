import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserDetails } from './entities/user.schema';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserDocument>,
    ) {}

    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id);
    }

    async findOne(options: any): Promise<UserDocument> {
        return this.userModel.findOne(options);
    }

    async addOne(user: UserDetails): Promise<UserDocument> {
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
