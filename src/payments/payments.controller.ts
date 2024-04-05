import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDateDto } from 'src/common/dto/pagination-date.dto';
import { Payment } from './entities/payment.entity';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@ApiTags( 'Payments' )
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { summary: 'Create a transaction',})
  @ApiResponse( { status: 201, description: 'Transaction created', type: Payment } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Post(':dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  createTransaction (
    @Body() createPaymentDto: CreatePaymentDto,
    @Param('dni', ParseIntPipe) dni: number
    ) {
    return this.paymentsService.createTransaction(dni, createPaymentDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { summary: 'Find all transactions given a date range',})
  @ApiResponse( { status: 201, description: 'Transactions found', type: [Payment] } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findAll ( 
    @Query() paginationDateDto:PaginationDateDto,
    ) {
    return this.paymentsService.findAll( paginationDateDto );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { summary: 'Find a client transactions',})
  @ApiResponse( { status: 201, description: 'Transactions found', type: [Payment] } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get('client-transactions/:dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findClientTrasactions ( @Param('dni', ParseIntPipe) dni:number,) {
    return this.paymentsService.findClientTrasactions( dni );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation( { summary: 'Update a transaction',})
  @ApiResponse( { status: 201, description: 'Transaction updated', type: Payment } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updateTransaction( id, updatePaymentDto);
  }
}
