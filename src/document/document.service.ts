import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Client } from 'src/clients/entities/client.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { sumTime } from 'src/common/functions/endDate'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class DocumentService {
  
  constructor ( 

  @InjectRepository( Document )
  private readonly documentRepository : Repository<Document>,

  private readonly clientService: ClientsService

  ) 
  
  {}


  async create( dni: number, createDocumentDto: CreateDocumentDto ) {

      const client: Client = await this.clientService.findOne( dni );

      const document = this.documentRepository.create( createDocumentDto );

      const actualDate = new Date();

      document.client = client;
      document.startDate = new Date( actualDate.getTime() );
      document.endDate = sumTime.sumMonths(actualDate, 1 );



      try {

      await this.documentRepository.save( document );

      return { 
      id: document.id,
      url: document.url, 
      startDate: document.startDate, 
      endDate: document.endDate,

      client: client.id 
    };

    }  catch (error) {
        
        this.handleDbExceptions(error);
      }

  }

  async findAll ( paginationDto: PaginationDto ) {

    const { limit = 1, offset = 0 } = paginationDto;

    return await this.documentRepository.find({

      take: limit,
      skip: offset,

    })
  }

  async findOne( dni: number ) {

    const document: Document  = await this.documentRepository.findOne( { where: { client: { dni } } } );

    if ( !document ) throw new NotFoundException( 'Document not found' );

    return document;
  }



  async update( id: string, updateDocumentDto: UpdateDocumentDto ) {

    const { months } = updateDocumentDto;

    const actualDate = new Date();

    const document = await this.documentRepository.preload( {

      id,
      ...updateDocumentDto,
      startDate: new Date( actualDate.getTime() ),
      endDate:  sumTime.sumMonths( actualDate, months ),
      status: true,

    } )

    if ( !document ) throw new NotFoundException( 'Document not found' );

    await this.documentRepository.save( document );

    return document;
  }


async remove( id: string ) {

    const document = await this.documentRepository.findOneBy( { id } );

    if ( !document ) throw new NotFoundException( 'Document not found' );
    
    await this.documentRepository.remove( document );


    return document;
  }


////////////

private handleDbExceptions (error : any) {

  if (error.code === '23505') throw new BadRequestException(error.detail);

  throw new InternalServerErrorException("Unexpected error. Check server logs");

}

}
