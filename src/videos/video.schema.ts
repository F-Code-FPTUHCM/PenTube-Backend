import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/Users/user.schema';

export type VideoDocument = HydratedDocument<Video>;
export type ViewDocument = HydratedDocument<View>;

@Schema()
export class Video {
    @Prop({ required: true })
    title: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true })
    // channelId: Channel;

    @Prop({ required: true })
    description: string;

    @Prop()
    category: string;

    @Prop([String])
    tags: string[];

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    totalFrame: number;
    @Prop({ required: true })
    status: string;

    @Prop({ default: null })
    key: string;

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Views' }] })
    views: string[];

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] })
    likes: User[];

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] })
    dislikes: User[];

    @Prop({ default: 0 })
    totalViews: number;

    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now(), immutable: true })
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now() })
    updatedAt: Date;
}

@Schema()
export class View {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true })
    userId: string;

    @Prop({ default: 0, min: 0 })
    frameWatched: number;

    @Prop({ default: 0, min: 0 })
    count: number;

    @Prop()
    location: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
export const ViewVideoSchema = SchemaFactory.createForClass(View);
