import { IsNotEmpty } from 'class-validator';

export class UpdateHistoriesDto {
    @IsNotEmpty()
    videoId: string;
}
