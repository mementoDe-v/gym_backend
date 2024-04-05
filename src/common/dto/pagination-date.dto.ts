import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class PaginationDateDto {


    @ApiProperty( { 
        description: "start date"
    } )
    @IsString()
    @Matches( /^\d{4}-\d{2}-\d{2}$/, {
        message: 'Use date valid format YYYY-MM-DD'
    } )
    startDate: string;

    @ApiProperty( { 
        description: "end date"
    } )
    @IsString()
    @Matches( /^\d{4}-\d{2}-\d{2}$/, {
        message: 'Use date valid format YYYY-MM-DD'
    } )
    endDate: string;

}