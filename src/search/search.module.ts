import { VietnameseConverter } from './../utils/vietnameseConverter';
import { VideoModule } from './../videos/video.module';
import { VideoSchema } from './../videos/video.schema';
import { SearchRepository } from './search.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrieSchema } from './entities/trie.type';
import { SearchService } from './search.service';
import { KMP } from './algorithms/kmp';

@Module({
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
    controllers: [],
    providers: [SearchService, SearchRepository, KMP, VietnameseConverter],
    exports: [SearchService, SearchRepository],
})
export class SearchModule {}
