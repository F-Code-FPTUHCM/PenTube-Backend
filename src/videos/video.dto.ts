import { City } from './video.schema';
import { invalidateMessage } from './../../config/validationPipes/config';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, Min, ValidateIf } from '@nestjs/class-validator';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VideoDTO {
    @ApiProperty()
    @IsOptional()
    id: string;

    @ApiProperty({
        description: 'The title of the video',
        minimum: 1,
        default: 1,
    })
    @IsNotEmpty({})
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    category: string;
    @ApiProperty()
    tags: string[];
    @ApiProperty()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    totalFrame: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    key: string;

    @ApiProperty()
    likes: string[];
    @ApiProperty()
    dislikes: string[];

    @ApiProperty()
    @IsOptional()
    @IsString({ message: invalidateMessage.invalid })
    thumbnail: string;

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    totalViews: number;

    @ApiProperty()
    @IsOptional()
    @IsDate({ message: invalidateMessage.invalid })
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class ViewDTO {
    @IsNotEmpty({
        message: invalidateMessage.required,
    })
    userId: string;

    @IsNotEmpty({
        message: invalidateMessage.required,
    })
    videoId: string;

    @IsOptional()
    @IsNumber({}, { message: invalidateMessage.invalid })
    frameWatched: number;

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    count: number;

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    currentFrame: number;

    @IsOptional()
    @IsBoolean()
    isWatched: boolean;

    @IsOptional()
    location: string[];
}
export class LocationDTO {
    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    city: City[];

    @IsNotEmpty()
    region: string;

    @IsNumber()
    totalView: number;

    constructor(location: Record<string, any>) {
        this.country = location.country.names.en;
        this.region = location.continent.names.en;
        this.city = [
            {
                name: location.city?.names.en || location.location.timeZone.split('/')[1],
                totalView: 0,
            },
        ];
        this.code = location.country.isoCode;
        this.totalView = 0;
    }
}
