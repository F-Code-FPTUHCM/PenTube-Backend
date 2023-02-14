import { VideoDTO } from './../../videos/video.dto';
import { Video } from './../../videos/video.schema';
import mongoose, { Schema, Document } from 'mongoose';

export type TrieDetails = {
    char: string;
    videos: [
        {
            videoId: mongoose.Types.ObjectId;
        },
    ];
};

export const TrieSchema = new Schema(
    {
        char: String,
        videos: [
            {
                videoId: mongoose.Types.ObjectId,
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
    videos: [
        {
            videoId: mongoose.Types.ObjectId;
        },
    ];
}

// Video result type
export interface ResultVideo extends VideoDTO {
    score: number;
}

export type Result = Array<ResultVideo>;
export type Videos = Array<Video>;
