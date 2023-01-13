import { Schema, Document } from 'mongoose';

export type UserDetails = {
    name: string;
    email: string;
    avatarUrl?: string;
    histories?: [
        {
            videoId: Schema.Types.ObjectId;
            lastVisitedAt: Date;
        },
    ];
};

export const UserSchema = new Schema(
    {
        name: String,
        email: String,
        avatarUrl: String,
        histories: [
            {
                videoId: Schema.Types.ObjectId,
                lastVisitedAt: Date,
            },
        ],
    },
    {
        timestamps: true,
        collection: 'users',
    },
);

export interface User extends Document {
    name: string;
    email: string;
    avatarUrl: string;
    histories: [
        {
            videoId: Schema.Types.ObjectId;
            lastVisitedAt: Date;
        },
    ];
}
