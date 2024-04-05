import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches } from "class-validator";

export class LoginUserDto {

@ApiProperty()
@IsString()
@IsEmail()
email: string;

@ApiProperty()
@IsString()
@Matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/, {
    message: `Invalid password format. 
    Please provide at least one upper case, 
    one lower case characters, one number, and one special character.`
})
password: string;


}