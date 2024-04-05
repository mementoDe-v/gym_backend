import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ClientsService } from 'src/clients/clients.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PaginationDateDto } from 'src/common/dto/pagination-date.dto';


@Injectable()
export class PaymentsService {


  constructor(

    private readonly clientService: ClientsService,
    
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

  ) {}

  async createTransaction (dni: number, createPaymentDto: CreatePaymentDto) {

    const client: Client = await this.clientService.findOne( dni );
    
    const payment: Payment = this.paymentRepository.create( createPaymentDto );

    let currentDate: Date = new Date();
    
    let isoFormatDate = currentDate.toISOString();

    payment.date = isoFormatDate.substring(0, 10);
    payment.client = client;

    await this.paymentRepository.save( payment );

    return payment;
  }


  async findAll (  paginationDateDto: PaginationDateDto ) {


    const { startDate, endDate } = paginationDateDto;

    const payments: Payment [] = await this.paymentRepository.find( {
      
      where: { 

        date: Between( startDate, endDate ),
      },

      order: {

        date: 'DESC'
      }
    } )

    if ( payments.length === 0 ) 
      throw new NotFoundException( 'There is not payments for the selected timeframe' );

    return payments;

  }

  async findClientTrasactions ( dni:number ) {

    const client: Client = await this.clientService.findOne( dni );

    const payments: Payment [] = await this.paymentRepository.find({

      where: { client }
      }
    );

    if ( payments.length === 0 ) 
      throw new NotFoundException( 'There is not payments for selected timeframe' );

    return payments;
  } 

  
  async updateTransaction(id: string, updatePaymentDto: UpdatePaymentDto) {

    const updatedPayment: Payment =  await this.paymentRepository.preload( { 
      
      id: id,
      ...updatePaymentDto

    } );

    if ( !updatePaymentDto)
      throw new NotFoundException( 'Transaction not found' );

    await this.paymentRepository.save( updatedPayment );

    return updatedPayment;
  }

}
