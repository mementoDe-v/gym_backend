import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './scheduleTask.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common/common.module';
import { Document } from 'src/document/entities/document.entity';
import { ConfigModule } from '@nestjs/config';




@Module({
  controllers: [],
  providers: [ScheduleTaskService,],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature( 
    [Client, Document,],
    ),
    CommonModule, ConfigModule
  ], 
    
})
export class ScheduleTaskModule {}
