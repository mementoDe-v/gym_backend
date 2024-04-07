import { Controller, Get, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseIntPipe, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { Document } from 'src/document/entities/document.entity';


@ApiTags( 'File upload' )
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { 
    summary: 'Upload a client health document', 
    description: 'Upload a client health document given the client dni. The health document expires after twelve months by default',
  })
  @ApiResponse( { status: 201, description: 'Document uploaded', type: Document } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )


  @Post('health-document/:dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  @UseInterceptors( FileInterceptor( 'file' ) )
async uploadHealthFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20000000 }),
          new FileTypeValidator( { fileType: /.pdf|jpg|jpeg|png/ } ),
        ]
      })
    )
    file: Express.Multer.File,
    @Param('dni', ParseIntPipe) dni: number
  ) {

    return await this.uploadService.uploadHealthFile( dni, file );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { 
  summary: 'Get health document urls', 
  description: 'Get health document urls given the client DNI',
})
  @ApiResponse( { 
    status: 201, 
    description: 'Urls found', 
    schema: {
      type: 'array',
      items : {
        type: 'string',
        example: 'https://example.com/health-document.pdf'
      }
    }
  })
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get( ':dni' )
  async getFileUrlByDni( @Param( 'dni' ) dni: string ) { 
    return this.uploadService.getFileUrlByDni( dni );

  }

}
