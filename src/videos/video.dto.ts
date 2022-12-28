import { invalidateMessage } from './../../config/validationPipes/config';
import { IsDate, IsNotEmpty, IsNumber, Min, ValidateIf } from '@nestjs/class-validator';

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

    views: string[];

    likes: string[];

    dislikes: string[];

    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    totalViews: number;

    @IsDate({ message: invalidateMessage.invalid })
    createdAt: Date;

    updatedAt: Date;
}

export class ViewDTO {
    @IsNotEmpty({
        message: invalidateMessage.required,
    })
    userId: string;

    @IsNotEmpty({ message: invalidateMessage.required })
    @ValidateIf(o => o.userId)
    @IsNumber({}, { message: invalidateMessage.invalid })
    frameWatched: number;

    @IsNotEmpty({ message: invalidateMessage.required })
    @IsNumber({ allowInfinity: true }, { message: invalidateMessage.invalid })
    @Min(0, { message: invalidateMessage.invalid })
    @ValidateIf(o => o.userId)
    count: number;

    location: string;
}
