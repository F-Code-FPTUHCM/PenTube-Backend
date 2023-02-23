import { forwardRef } from '@nestjs/common/utils';
import { AppConfig } from './../../config/config.module';
import { TrieSchema } from './entities/trie.type';
import { VideoSchema } from './../videos/video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../login/auth.module';
import { VideoModule } from './../videos/video.module';
import { SearchRepository } from './search.repository';
import { KMP } from './algorithms/KMP';
import { SearchController } from './search.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import configYAML from '../../config/config';

describe('Should return list of video with point', () => {
    let kmp: KMP;
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [KMP],
        }).compile();
        kmp = moduleRef.get<KMP>(KMP);
    });

    describe('kmp', () => {
        it('should be return', () => {
            expect(kmp.process('abc', 'abc')).toBe(3);
        });
    });
});
