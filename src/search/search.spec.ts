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

describe('Should return list of video with point', () => {
    let searchService: SearchService;
    let searchController: SearchController;
    let kmp: KMP;
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forFeature([
                    {
                        name: 'TrieSearch',
                        schema: TrieSchema,
                    },
                    {
                        name: 'Videos',
                        schema: VideoSchema,
                    },
                ]),
                VideoModule,
            ],
            controllers: [SearchController],
            providers: [SearchService, SearchRepository, KMP],
        }).compile();

        searchService = moduleRef.get<SearchService>(SearchService);
        searchController = moduleRef.get<SearchController>(SearchController);
        kmp = moduleRef.get<KMP>(KMP);
    });

    describe('kmp', () => {
        it('should be return', () => {
            expect(kmp.process('abc', 'abc')).toBe(3);
        });
    });
});
