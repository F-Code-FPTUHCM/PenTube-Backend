import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrieSchema } from './entities/trie.type';

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
    providers: [],
})
export class SearchModule {}
