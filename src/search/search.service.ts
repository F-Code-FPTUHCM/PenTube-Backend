import { VideoDTO } from './../videos/video.dto';
import { VietnameseConverter } from './../utils/vietnameseConverter';
import { KMP } from './algorithms/KMP';
import { VideoDocument } from './../videos/video.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SearchRepository } from './search.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ResultVideo, Trie, TrieDetails, Videos } from './entities/trie.type';

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
        const listWord: string[] = content.split(/[^a-zA-Z]/);
        let result: ResultVideo[] = [];
        for (let i = 0; i < listWord.length; i++) {
            const temp: ResultVideo[] = await this.KMPAlgorithms(listWord[i]);
            for (let j = 0; j < temp.length; j++) {
                let ok = true;
                result = result.map(res => {
                    const video = new this.videoModel(res);
                    const videoTmp = new this.videoModel(temp[j]);
                    if (video.id === videoTmp.id) {
                        ok = false;
                        return { ...temp[j], score: res.score + temp[j].score };
                    }
                    return res;
                });
                if (ok) result.push(temp[j]);
            }
        }
        if (result.length > 0) {
            result.sort((a, b) => {
                if (a.score < b.score) return 1;
                else if (a.score > b.score) return -1;
                else return b.totalViews - a.totalViews;
            });
        }
        return result;
    }

    async findVideoByWord(word: string): Promise<Videos> {
        let newWord = word;
        let trie = await this.searchRepository.getTrieByChar(word);
        let videoList = trie ? trie.videoList : [];
        if (word === '') {
            return videoList;
        }
        while (newWord !== '' && videoList.length < 10) {
            newWord = newWord.substring(0, newWord.length - 2);
            trie = await this.searchRepository.getTrieByChar(newWord);
            videoList = trie ? trie.videoList : [];
        }
        return videoList;
    }

    async buildTrieByTitle(title: string, videoId: string): Promise<boolean> {
        const listWord: string[] = title.split(/[^a-zA-Z]/);
        for (let i = 0; i < listWord.length; i++)
            if (listWord[i] && listWord[i] !== '') {
                this.buildTrieByWord('', videoId, listWord[i], 0);
            }
        return true;
    }

    // build trie by title of video
    async buildTrieByWord(
        id: string,
        videoId: string,
        word: string,
        height: number,
    ): Promise<boolean> {
        let currentId = null;
        if (height > word.length) return true;
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

    // using KMP algorithm to find the most relevant video by one word in the query
    async KMPAlgorithms(word: string): Promise<Array<ResultVideo>> {
        const videos: Videos = await this.findVideoByWord(word);
        const result: Array<ResultVideo> = videos.map(video => {
            const convertedTitle = this.vietnameseConverter.toNonAccent(video.title);
            const convertedWord = this.vietnameseConverter.toNonAccent(word);
            const score = this.kmp.process(convertedWord, convertedTitle);
            const newVideo = this.videoModel.castObject(video);
            return { ...newVideo, score };
        });
        return result;
    }
}
