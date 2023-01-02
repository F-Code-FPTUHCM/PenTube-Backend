import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/Users/user.schema';

export type VideoDocument = HydratedDocument<Video>;
export type ViewDocument = HydratedDocument<View>;
export type LocationDocument = HydratedDocument<Location>;
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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Videos', required: true })
    videoId: string;

    @Prop({ default: 0, min: 0 })
    frameWatched: number;

    @Prop({ default: 0, min: 0 })
    currentFrame: number;

    @Prop({ default: 0, min: 0 })
    count: number;

    @Prop({ default: 0, min: 0 })
    isWatched: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locations' }] })
    Location: string;
}

export class Location {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    region: string;

    @Prop({ required: true })
    city: string;

    @Prop({ default: 0 })
    totalView: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
export const ViewVideoSchema = SchemaFactory.createForClass(View);
export const LocationSchema = SchemaFactory.createForClass(Location);
