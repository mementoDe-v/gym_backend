import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Client } from './entities/client.entity';


@ApiTags( 'Clients' )
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
 
  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Create a client',})
  @ApiResponse( { status: 201, description: 'Client created', type: Client } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Post()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: User,
    ) {
    return this.clientsService.create(createClientDto, user);
  }


  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Get client list', 
    description: 'Use the pagination parameters to limit the result' 
})
  @ApiResponse( { status: 201, description: 'Array of client entity', type:[Client]} )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.clientsService.findAll( paginationDto );
  }

  
  @ApiBearerAuth( 'access-token' )
  @ApiOperation({summary: 'Get one client',})
  @ApiResponse( { status: 201, description: 'Client found', type: Client } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Get(':dni')
  @Auth( ValidRoles.user, ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param('dni' , ParseIntPipe) dni: number) {
    return this.clientsService.findOne(dni);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ summary: 'Update a client',})
  @ApiResponse( { status: 201, description: 'Client updated', type: Client } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({summary: 'Update client suscription',})
  @ApiResponse( { status: 201, description: 'Subscription updated', type: Client } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch('renew-suscription/:dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  renewalUpdate(@Param('dni', ParseIntPipe) dni: number, 
  @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.renewalUpdate(dni, updateClientDto);
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ summary: 'Delete a client',})
  @ApiResponse( { status: 201, description: 'Client deleted', type: Client } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Delete(':dni')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  remove(@Param('dni', ParseIntPipe) dni: number) {
    return this.clientsService.remove(dni);
  }
}
