import { VietnameseConverter } from './../utils/vietnameseConverter';
import { KMP } from './algorithms/kmp';
import { VideoDocument } from './../videos/video.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SearchRepository } from './search.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ResultVideo, Trie, TrieDetails, Videos } from './entities/trie.type';
import { plainToClass } from 'class-transformer';
import { VideoDTO } from 'src/videos/video.dto';

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

    async findVideo(content: string) {
        const listWord: string[] = content.split(/[^a-zA-Z]/);
        let result: ResultVideo[] = [];
        for (let i = 0; i < listWord.length; i++) {
            if (listWord[i] && listWord[i] !== '') {
                const temp: ResultVideo[] = await this.KMPAlgorithms(listWord[i]);
                for (let j = 0; j < temp.length; j++) {
                    let ok = true;
                    result = result.map(res => {
                        if (res.url === temp[j].url) {
                            ok = false;
                            return { ...temp[j], score: res.score + temp[j].score };
                        }
                        return res;
                    });
                    if (ok) result.push(temp[j]);
                }
            }
        }
        console.log(result);
        return result;
    }

    async findVideoByWord(word: string): Promise<Videos> {
        let newWord = word;
        let trie = await this.searchRepository.getTrieByChar(word);
        let videoList = trie ? trie.videoList : [];
        //TODO: change 1 to 10 after test because don't have enough video
        while (newWord !== '' && videoList.length < 1) {
            newWord = newWord.substring(0, newWord.length - 2);
            trie = await this.searchRepository.getTrieByChar(newWord);
            videoList = trie ? trie.videoList : [];
        }
        return videoList;
    }

    async buildTrieByWord(id: string, videoId: string, word: string, height: number) {
        let currentId = null;
        // root of trie has height = 0
        if (height === 0) {
            const root = await this.searchRepository.getRoot();
            currentId = root._id;
        } else {
            currentId = id;
        }
        this.searchRepository.addVideoById(currentId, videoId);
        let child: Trie | TrieDetails = await this.searchRepository.getTrieByChar(
            word.substring(0, height + 1),
        );
        if (child === null) {
            child = await this.searchRepository.createTrie(word.substring(0, height + 1));
        }
        this.buildTrieByWord(child._id, videoId, word, height + 1);
        return true;
    }

    async KMPAlgorithms(word: string): Promise<Array<ResultVideo>> {
        const videos: Videos = await this.findVideoByWord(word);
        const result: Array<ResultVideo> = videos.map(video => {
            const convertedTitle = this.vietnameseConverter.toNonAccent(video.title);
            const convertedWord = this.vietnameseConverter.toNonAccent(word);
            const score = this.kmp.process(convertedWord, convertedTitle);
            const videoDTO = plainToClass(VideoDTO, video);
            return { ...videoDTO, score };
        });
        console.log('kmp', result);
        return result;
    }
}
