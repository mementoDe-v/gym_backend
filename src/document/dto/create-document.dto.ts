import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {

@ApiProperty( {
    required: false,
} )
@IsOptional()
@IsString()
url:string;

@ApiProperty(  { 
    example: 96160893
} )
@IsInt()
dni: number;

}
