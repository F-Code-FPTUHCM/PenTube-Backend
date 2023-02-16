import { VideoDTO } from './../videos/video.dto';
import { VietnameseConverter } from './../utils/vietnameseConverter';
import { KMP } from './algorithms/kmp';
import { VideoDocument } from './../videos/video.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SearchRepository } from './search.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ResultVideo } from './entities/trie.type';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SearchService {
    constructor(
        private readonly searchRepository: SearchRepository,
        @InjectModel('Videos') private readonly videoModel: Model<VideoDocument>,
        private readonly kmp: KMP,
        private readonly vietnameseConverter: VietnameseConverter,
    ) {
        kmp = new KMP();
        vietnameseConverter = new VietnameseConverter();
    }

    // find video by function
    async findVideo(content: string) {
        // TODO: this return just for demo kmp, change this when complete the whole service
        const rankedVideos = await this.KMPAlgorithms(content);
        console.log(rankedVideos);
        return rankedVideos;
    }

    // find video using with every single word
    async findVideoByWord(word: string) {
        return [];
    }

    // build trie by title of video
    async buildTrieByWord(
        id: string,
        videoId: string,
        word: string,
        height: number,
    ): Promise<boolean> {
        let currentId = null;
        // root of trie has height = 0
        if (height === 0) {
            const root = await this.searchRepository.getRoot();
            currentId = root._id;
        } else {
            currentId = id;
        }
        this.searchRepository.addVideoById(currentId, videoId);
        let child = await this.searchRepository.getTrieByChar(word.substring(0, height + 1));
        if (child === null) {
            child = await this.searchRepository.createTrie(word.substring(0, height + 1));
        }
        this.buildTrieByWord(child._id, videoId, word, height + 1);
        return true;
    }

    // using KMP algorithm to find the most relevant video by one word in the query
    async KMPAlgorithms(word: string): Promise<Array<ResultVideo>> {
        const videos = await this.videoModel.find().exec();
        const result: Array<ResultVideo> = videos.map(video => {
            const convertedTitle = this.vietnameseConverter.toLowerCaseNonAccent(video.title);
            const convertedWord = this.vietnameseConverter.toLowerCaseNonAccent(word);
            const score = this.kmp.process(convertedWord, convertedTitle);
            const videoDTO = plainToClass(VideoDTO, video);
            return { ...videoDTO, score };
        });
        return result;
    }
}
