import { SearchRepository } from './search.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
    constructor(private readonly searchRepository: SearchRepository) {}

    async findVideo(content: string) {
        return [];
    }

    async findVideoByWord(word: string) {
        return [];
    }

    async buildTrieByWord(word: string, videoId: string) {
        return true;
    }

    async KMPAgorithms() {
        return [];
    }
}
