
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';


export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    tempEmail: string;

}
