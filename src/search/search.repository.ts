import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Trie } from './entities/trie.type';

@Injectable()
export class SearchRepository {
    constructor(
        @InjectModel('TrieSearch')
        private readonly trieModel: Model<Trie>,
    ) {}

    async getRoot(): Promise<Trie> {
        return this.trieModel.findOne({ char: 'root' });
    }

    async addVideoById(_id: string, videoId: string) {
        const id = new mongoose.Types.ObjectId(videoId);
        const videos = await this.trieModel.findOne({ _id }).then(result => result.videos);
        // videos.push({ videoId: id });
        console.log('videos', videos);
        this.trieModel.updateOne({ _id }, { videos });
    }
}
