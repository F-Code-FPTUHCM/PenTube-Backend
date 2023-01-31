import { IsNotEmpty } from 'class-validator';

export class UpdateHistoriesDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    videoId: string;
}
