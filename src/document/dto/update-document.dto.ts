
import { ApiProperty } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {

    @ApiProperty( )
    @IsInt( )
    @Min( 1 )
    @IsOptional()
    months: number;

}
