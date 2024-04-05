import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, } from "class-validator";


export class PasswordResetDto {

    @ApiProperty()
    @IsString( )
    @IsEmail()
    email: string;


}