import { VideoDTO } from './../../videos/video.dto';
import { Video } from './../../videos/video.schema';
import mongoose, { Schema, Document } from 'mongoose';

export type TrieDetails = {
    _id: string;
    char: string;
    videoList: Videos;
};

export const TrieSchema = new Schema(
    {
        char: String,
        videoList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Videos',
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
    videoList: mongoose.Types.ObjectId[];
}

// Video result type
export class ResultVideo extends Video {
    score: number;
}

export type Result = Array<ResultVideo>;
export type Videos = Array<Video>;
