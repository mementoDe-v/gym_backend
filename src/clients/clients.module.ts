import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Document } from 'src/document/entities/document.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ClientsController],
  exports: [TypeOrmModule, ClientsService],
  providers: [ClientsService],
  imports: [ 
    TypeOrmModule.forFeature( 
      [Client, Document] 
      
      ),
      CommonModule,
      AuthModule
  ]
})
export class ClientsModule {}
