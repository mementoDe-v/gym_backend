import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";


export class PasswordUpdateDto {


    @ApiProperty({
        example: 'Abcd12545*',
        description: `Please ensure your password includes at least 10 characters, 
        with at least one uppercase letter, one lowercase letter, one number, and one special character.`
})
    @IsString()
    @Matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/, {
    message: `Invalid password format. 
    Please provide at least one upper case, 
    one lower case character, one number, and one special character.`
})
    password: string;
}