import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ParseIntPipe } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Document } from './entities/document.entity';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags( 'Client health document' )
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { summary: 'Create a document', 
  description: 'When a new health document is created for selected client it assign one month timeframe expiration by default.' 
})
  @ApiResponse( { status: 201, description: 'Document created', type: Document } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )
  
  @Post('create')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(
  @Body('dni', ParseIntPipe) dni: number, 
  @Body() createDocumentDto: CreateDocumentDto
  
  ) {
    return this.documentService.create(dni, createDocumentDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: "Get all documents",
    description: "Use the pagination parameters to limit the result"
  })
  @ApiResponse( { status: 201, description: 'Documents found', type: [Document]  } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findAll( @Query() paginationDto: PaginationDto) {
    return this.documentService.findAll( paginationDto );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ summary: 'Get one Document',})
  @ApiResponse( { status: 201, description: 'Document found', type: Document  } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get(':dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param( 'dni', ParseIntPipe ) dni: number) {
    return this.documentService.findOne( dni );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
  summary: 'Update a Document', 
  description: `This endpoint is used to update a document in cases where the client does not have the required health document. 
  You can add more time with this endpoint`
})
  @ApiResponse( { status: 201, description: 'Document updated.', type: Document  } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  update(
  @Param('id', ParseUUIDPipe) id: string, 
  @Body() updateDocumentDto: UpdateDocumentDto,
  
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ summary: 'Delete a Document',})
  @ApiResponse( { status: 201, description: 'Document deleted.', type: Document  } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Delete(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentService.remove(id);
  }
}
