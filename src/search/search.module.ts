import { SearchRepository } from './search.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrieSchema } from './entities/trie.type';
import { SearchService } from './search.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'TrieSearch',
                schema: TrieSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [SearchService, SearchRepository],
    exports: [SearchService, SearchRepository],
})
export class SearchModule {}
