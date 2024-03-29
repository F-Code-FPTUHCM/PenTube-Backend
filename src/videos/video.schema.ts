import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, HydratedDocument, Mongoose, Types } from 'mongoose';
import { User } from '../Users/entities/user.schema';

export type VideoDocument = HydratedDocument<Video>;
export type ViewDocument = HydratedDocument<View>;
export type LocationDocument = HydratedDocument<Location>;
export type ChannelDocument = HydratedDocument<Channel>;
const CityRaw = {
    name: {
        type: String,
    },
    totalView: {
        type: Number,
    },
};
@Schema()
export class Channel {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: string;
}

@Schema({ id: true })
export class Video {
    @ApiProperty()
    @Prop({ required: true })
    title: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Channels' })
    channel: string;

    @Prop({ required: true })
    description: string;

    // @Prop()
    // category: string;

    @Prop([String])
    tags: string[];

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    totalFrame: number;
    @Prop({ required: true })
    status: string;

    @Prop({ default: null })
    thumbnail: string;

    @Prop({ default: null })
    key: string;

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Views' }] })
    views: View[];

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] })
    likes: string[];

    @Prop({ default: [], type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] })
    dislikes: User[];

    @Prop({ default: 0 })
    totalViews: number;

    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now(), immutable: true })
    createdAt: string;

    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now() })
    updatedAt: string;
}

@Schema()
export class View {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    userId: string;

    @Prop({ required: true })
    ip: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Videos', required: true })
    videoId: string;

    @Prop({ default: 0, min: 0 })
    frameWatched: number;

    @Prop({ default: 0, min: 0 })
    currentFrame: number;

    @Prop({ default: 0, min: 0 })
    count: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locations' }] })
    location: Location[];
}

export class City {
    name: string;
    totalView: number;
}

@Schema()
export class Location {
    @Prop({ default: null, required: true })
    code: string;

    @Prop({ default: null })
    country: string;

    @Prop({ default: null })
    region: string;

    @Prop({ required: true, type: [raw({ ...CityRaw })] })
    city: City[];

    @Prop({ default: 0 })
    totalView: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
export const ViewVideoSchema = SchemaFactory.createForClass(View);
export const LocationSchema = SchemaFactory.createForClass(Location);
export const ChannelSchema = SchemaFactory.createForClass(Channel);
