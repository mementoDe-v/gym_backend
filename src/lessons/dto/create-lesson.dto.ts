import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, Matches } from "class-validator";
import { WeekDays } from "src/common/dto/week-days.dto";


export class CreateLessonDto {

    @ApiProperty()
    @IsString()
    @Matches( /[A-Z]$/ )
    lesson: string;

    @ApiProperty({ description: "Available spots per lesson" })
    @IsInt()
    count: number;

    @ApiProperty()
    @IsString()
    @Matches( /^([01]?[0-9]|2[0-3]):([0-5][0-9])-([01]?[0-9]|2[0-3]):([0-5][0-9])$/ )
    lessonSchedule: string;

    @ApiProperty({
        enum: WeekDays,
        example: 'Monday',
    })
    @IsEnum( WeekDays )
    lessonDay: WeekDays;

    @ApiProperty()
    @IsString()
    lessonRoom: string;

    @ApiProperty()
    @IsString()
    lessonInstructor: string;


}
