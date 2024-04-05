import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EmailService } from 'src/common/services/email.service';
import { sumTime } from 'src/common/functions/endDate'; 
import { substractTime } from 'src/common/functions/substract-dates';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ClientsService {

  private readonly logger = new Logger('ClientService');
  
  constructor(
  
    private emailService: EmailService,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,


  ) {}
  
  
  async create(createClientDto: CreateClientDto, user: User) {
    
    try {
    
    const client = this.clientRepository.create(createClientDto);

    const actualDate = new Date();

    client.startDate = new Date( actualDate.getTime() );
    client.renewalDate = sumTime.sumMonths(actualDate, client.plan );
    client.user = user;
      
    await this.clientRepository.save( client );

    const emailBody = await this.emailClientTemplate( client.dni );
    const emailSubject = "Welcome to test Gym";

    await this.emailService.sendEmail( client.email, 
    emailSubject,
    emailBody, 
    );
      return client;

    } catch (error) {

      this.handleDbExceptions(error);

    }

  }

  

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    return await this.clientRepository.find({

      take: limit,
      skip: offset,

    })

  
  }

  async findOne( dni: number ) {

    const client: Client = await this.clientRepository.findOneBy( { dni } );

    if ( !client ) throw new NotFoundException( "Client not found" );

    const PlanRenewal: boolean = substractTime.substractDays( client.renewalDate )

    if (  !PlanRenewal ) {

      client.planStatus = false;

      await this.clientRepository.save( client );

    }

    return client;

  }


  async update(id: string, updateClientDto: UpdateClientDto) {


    try {

    const client = await this.clientRepository.preload( {

        id: id,
        ...updateClientDto

      } );

      if ( !client ) throw new NotFoundException( "Client not found" );
      if ( client.planStatus === false ) throw new BadRequestException( " Client not active. Please renew the membership " );

    await this.clientRepository.save( client );

      return client;
          
        } catch (error) {
        
        this.handleDbExceptions( error )
          
        }   
  }


  async renewalUpdate(dni: number, updateClientDto: UpdateClientDto) {

  const client = await this.findOne( dni );
  
  const newStartDate = new Date();
  const renewalDate = sumTime.sumMonths(newStartDate, updateClientDto.plan);

  const updateResult = await this.clientRepository.update(
    { dni },
    {
      startDate: newStartDate,
      renewalDate: renewalDate,
      activeMonths: () => `activeMonths + ${updateClientDto.plan}`,
      planStatus: true,
      ...updateClientDto,
    }
  );

  if (updateResult.affected === 0) {
    throw new NotFoundException(`Client with DNI ${dni} not found`);
  }

  return this.findOne( dni );
}


  async remove(dni: number) {

    const client = await this.findOne( dni );

    await this.clientRepository.remove( client );

    return client;


  }


/////////////////////////////////////////

private handleDbExceptions (error : any) {

  if (error.code === '23505') throw new BadRequestException(error.detail);

  console.log( error );

  throw new InternalServerErrorException("Unexpected error. Check server logs");

}

private async emailClientTemplate (dni: number): Promise<string> {

  const client = await this.findOne( dni );

  const emailBody = `Welcome ${client.name}, you are now our partner!<br>
  <br>
  <strong>Your details:</strong><br>
  Email: ${client.email}<br>
  Birthday: ${client.birthday}<br>
  DNI: ${client.dni}<br>
  Phone: +${client.phone}<br>
  Plan: ${client.plan} months<br>
  Renewal Date: ${client.renewalDate}<br>`

  return emailBody;

}


}
