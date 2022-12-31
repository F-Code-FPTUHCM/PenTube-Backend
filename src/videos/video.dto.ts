import { invalidateMessage } from './../../config/validationPipes/config';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, Min, ValidateIf } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class VideoDTO {
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

    @IsOptional()
    @ValidateIf(o => o.userId)
    @IsNumber({}, { message: invalidateMessage.invalid })
    frameWatched: number;

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    @ValidateIf(o => o.userId)
    count: number;

    @IsOptional()
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    @ValidateIf(o => o.userId)
    currentFrame: number;

    location: string;
}
