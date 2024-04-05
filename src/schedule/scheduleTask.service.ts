import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { substractTime } from 'src/common/functions/substract-dates';  
import { EmailService } from 'src/common/services/email.service';
import { Document } from 'src/document/entities/document.entity';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class ScheduleTaskService {

  private readonly logger = new Logger( ScheduleTaskService.name );
  
  constructor (
    
  private configService:ConfigService,
  private emailService: EmailService,
  
  @InjectRepository(Client)
  private readonly clientRepository: Repository<Client>,
  @InjectRepository(Document)
  private readonly documentRepository: Repository<Document>,
  
  )  {}

@Cron('0 0 * * *')

async checkSuscriptionDueDate () {

  const clients = await this.clientRepository.find();
  let nonActiveClients = [];

  let updatePromises = clients.map(async (client) => {
    const differenceInDays = substractTime.substractDays(client.renewalDate);

    const isValid = client.planStatus;
    
    if ( !differenceInDays  && isValid ) {
      
      client.planStatus = false;
      nonActiveClients.push( client );
      await this.clientRepository.save(client);
    }
  });

  await Promise.all(updatePromises);

this.logger.log(  'Plan renewal daily check has been executed' );

this.emailService.sendEmail( 
this.configService.get( 'APP_EMAIL' ),
'Plan renewal daily', 
'Plan renewal daily check has been executed' 
)

if ( nonActiveClients.length > 0 ) {

  this.emailService.sendEmail(

  this.configService.get( 'APP_EMAIL' ), 
  `Terminated clients`,
  `Executed<br>
  <br>
  ${nonActiveClients.map( (client) => JSON.stringify( {
    
    name: client.name,
    dni: client.dni,
    phone: client.phone 
    
  } ))}
  `);
  }

}

@Cron('0 0 * * *')

async checkClienthealthDocument ( ) {

  const document = await this.documentRepository.find();

  let updateDocumentStatus = document.map( async (document) => {

    const differenceInDays = substractTime.substractDays( document.endDate );

    const isValid = document.status;

    if ( !differenceInDays  && isValid ) {

      document.status = false;
      await this.documentRepository.save( document );
    }})

    Promise.all(  updateDocumentStatus );

    this.logger.log(  'Health history study termination date task executed' );

    this.emailService.sendEmail( 
    'jose_araujo24@hotmail.com',
    'Health study termination check', 
    'Health study termination date task executed' )
  
  }
}
