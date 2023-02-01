import { Schema, Document } from 'mongoose';

export type TrieDetails = {
    char: string;
    parent: Schema.Types.ObjectId;
    children: [
        {
            trie: Schema.Types.ObjectId;
        },
    ];
    videos: [
        {
            videoId: Schema.Types.ObjectId;
        },
    ];
};

export const TrieSchema = new Schema(
    {
        char: String,
        parent: Schema.Types.ObjectId,
        children: [
            {
                trie: Schema.Types.ObjectId,
            },
        ],
        videos: [
            {
                videoId: Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
        collection: 'trie-search',
    },
);

export interface Trie extends Document {
    char: string;
    parent: Schema.Types.ObjectId;
    children: [
        {
            trie: Schema.Types.ObjectId;
        },
    ];
    videos: [
        {
            videoId: Schema.Types.ObjectId;
        },
    ];
}
