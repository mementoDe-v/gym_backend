import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsIn, IsInt, IsPositive, IsString, Matches } from "class-validator";

export class CreateClientDto {


    @ApiProperty()
    @IsString()
    @Matches(/^[A-Za-z]+$/, {
        message: "Alphabetical characters accepted only"
    })
    name: string;
    
    @ApiProperty()
    @IsString()
    @Matches(/^[A-Za-z]+$/, {
        message: "Alphabetical characters accepted only"
    })
    lastname: string;

    @ApiProperty()
    @IsString()
    @Matches(/^male$|^female$|^binary$/, {
        message: "Please add a gender only [male, female, binary]"
    })
    gender:string;

    @ApiProperty()
    @IsString()
    @Matches(/^\d\d\d\d-\d\d-\d\d$/, {
        message: "Invalid date format. YY-MM-DD"
    })
    birthday: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    dni:number;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsInt( {
        message: "Numbers only accepted"
    } )
    @IsPositive({
        message: "Only positive numbers allowed"
    })
    @IsIn([1,3,6,12] ,{
        message: 'Please enter the amount of plan months [1,3,6, or 12] months',
    })
    plan:number;

    @ApiProperty()
    @IsBoolean()
    planStatus: boolean;

  

}
