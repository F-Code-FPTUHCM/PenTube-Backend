import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trie } from './entities/trie.type';

@Injectable()
export class SearchRepository {
    constructor(
        @InjectModel('TrieSearch')
        private readonly trieModel: Model<Trie>,
    ) {}
}
