import { VideoDTO } from './../videos/video.dto';
import { VietnamesConverter } from './../utils/vietnameseConverter';
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
        private readonly vietnameseConverter: VietnamesConverter,
    ) {
        kmp = new KMP();
        vietnameseConverter = new VietnamesConverter();
    }

    async findVideo(content: string) {
        // TODO: this return just for demo kmp, change this when complete the whole service
        const rankedVideos = await this.KMPAlgorithms(content);
        console.log(rankedVideos);
        return rankedVideos;
    }

    async findVideoByWord(word: string) {
        return [];
    }

    async buildTrieByWord(word: string, videoId: string) {
        return true;
    }

    async KMPAlgorithms(word: string): Promise<Array<ResultVideo>> {
        const videos = await this.videoModel.find().exec();
        const result: Array<ResultVideo> = videos.map(video => {
            const convertedTitle = this.vietnameseConverter.toLowerCaseNonAccent(video.title);
            const convertedWord = this.vietnameseConverter.toLowerCaseNonAccent(word);
            const score = this.kmp.process(convertedWord, convertedTitle);
            const videoDTO = plainToClass(VideoDTO, video.toObject());
            return { ...videoDTO, score };
        });
        return result;
    }
}
