import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class VerifyEmailDto {

    @ApiProperty({ example: 'c19891558ef1055e' })
    
    @IsNotEmpty()
    @IsString()
    emailToken: string;

}