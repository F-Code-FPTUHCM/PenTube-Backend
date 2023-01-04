import { City } from './video.schema';
import { invalidateMessage } from './../../config/validationPipes/config';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, Min, ValidateIf } from '@nestjs/class-validator';
import { IsBoolean, IsOptional } from 'class-validator';

export class VideoDTO {
    @IsOptional()
    id: string;
    @IsNotEmpty({})
    title: string;

    @IsNotEmpty()
    description: string;

    category: string;

    tags: string[];

    @IsNotEmpty()
    url: string;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    totalFrame: number;

    status: string;

    key: string;

    likes: string[];

    dislikes: string[];

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    totalViews: number;

    @IsOptional()
    @IsDate({ message: invalidateMessage.invalid })
    createdAt: Date;

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
                name: location.city.names.en,
                totalView: 0,
            },
        ];
        this.code = location.country.isoCode;
        this.totalView = 0;
    }
}
