import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    avatarUrl: string;
}
