import { Schema, Prop, raw, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, ObjectId, HydratedDocument } from 'mongoose';

export interface History {
    videos: ObjectId;
    lastVisitedAt: Date;
}

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
            video: { type: mongoose.Schema.Types.ObjectId, ref: 'Videos' },
            lastVisitedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
        }),
    ])
    histories: History;
}

export const UsersSchema = SchemaFactory.createForClass(User);
