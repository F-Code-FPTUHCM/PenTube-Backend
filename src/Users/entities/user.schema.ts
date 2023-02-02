import { Schema, Prop, raw, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, ObjectId, HydratedDocument, Document } from 'mongoose';

export interface History {
    videoId: ObjectId;
    lastVisitedAt: Date;
}

export type UserDetails = {
    name: string;
    email: string;
    avatarUrl?: string;
    histories?: History[];
};

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ default: null })
    avatarUrl: string;

    @Prop({ default: null })
    location: string;

    @Prop([
        raw({
            videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Videos' },
            lastVisitedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
        }),
    ])
    histories: History[];
}

export const UsersSchema = SchemaFactory.createForClass(User);

// export const UserSchema = new Schema(
//     {
//         name: String,
//         email: String,
//         avatarUrl: String,
//         histories: [
//             {
//                 videoId: Schema.Types.ObjectId,
//                 lastVisitedAt: Date,
//             },
//         ],
//     },
//     {
//         timestamps: true,
//         collection: 'users',
//     },
// );

// export interface UserDocumentV2 extends Document {
//     name: string;
//     email: string;
//     avatarUrl: string;
//     histories: [
//         {
//             videoId: mongoose.Schema.Types.ObjectId;
//             lastVisitedAt: Date;
//         },
//     ];
// }
