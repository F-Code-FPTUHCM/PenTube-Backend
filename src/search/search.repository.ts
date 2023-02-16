import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Trie, TrieDetails } from './entities/trie.type';

@Injectable()
export class SearchRepository {
    constructor(
        @InjectModel('TrieSearch')
        private readonly trieModel: Model<Trie>,
    ) {}

    async getRoot(): Promise<Trie> {
        const root = await this.trieModel.findOne({ char: '' });
        if (root == null) {
            return await this.trieModel.create({ char: '', videos: [] });
        }
        return await this.trieModel.findOne({ char: '' });
    }

    async addVideoById(_id: string, videoId: string) {
        const id = new mongoose.Types.ObjectId(videoId);
        const Trie = await this.trieModel.findOne({ _id });
        let ok = true;
        Trie.videoList.map(vid => (vid.toString() === id.toString() ? (ok = false) : 0));
        if (ok) await Trie.videoList.push(id);
        await Trie.save();
    }

    async getTrieByChar(char: string): Promise<TrieDetails> {
        return await this.trieModel.findOne({ char }).populate('videoList');
    }

    async createTrie(char: string): Promise<Trie> {
        return await this.trieModel.create({ char, videos: [] });
    }
}
