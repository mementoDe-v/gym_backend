import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class VerifyEmailDto {

    @ApiProperty({ example: 'c19891558ef1055e' })
    
    @IsString()
    emailToken: string;

}