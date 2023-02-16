import { SearchController } from './search.controller';
import { VietnameseConverter } from './../utils/vietnameseConverter';
import { VideoModule } from './../videos/video.module';
import { VideoSchema } from './../videos/video.schema';
import { SearchRepository } from './search.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrieSchema } from './entities/trie.type';
import { SearchService } from './search.service';
import { KMP } from './algorithms/kmp';
import { forwardRef } from '@nestjs/common/utils';

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
        forwardRef(() => VideoModule),
    ],
    controllers: [SearchController],
    providers: [SearchService, SearchRepository, KMP, VietnameseConverter],
    exports: [SearchService, SearchRepository],
})
export class SearchModule {}
