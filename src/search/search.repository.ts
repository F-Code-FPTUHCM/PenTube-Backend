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
        const root = await this.trieModel.findOne({ char: '' });
        if (root == null) {
            return await this.trieModel.create({ char: '', videos: [] });
        }
        return await this.trieModel.findOne({ char: '' });
    }

    async addVideoById(_id: string, videoId: string) {
        const id = new mongoose.Types.ObjectId(videoId);
        const videos = await this.trieModel.findOne({ _id }).then(result => result.videos);
        let ok = true;
        videos.map(vid => (vid.videoId.toString() === id.toString() ? (ok = false) : 0));
        if (ok) await videos.push({ videoId: id });
        await this.trieModel.updateMany({ _id }, { videos });
    }

    async getTrieByChar(char: string): Promise<Trie> {
        return await this.trieModel.findOne({ char });
    }

    async createTrie(char: string): Promise<Trie> {
        return await this.trieModel.create({ char, videos: [] });
    }
}
