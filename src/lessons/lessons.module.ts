import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity';
import { Client } from 'src/clients/entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { ClientsService } from 'src/clients/clients.service';
import { EmailService } from 'src/common/services/email.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, ClientsService, EmailService],
  imports: [ 
    TypeOrmModule.forFeature( 
      [Client, Lesson] 
      
      ),

    ClientsModule,
    CommonModule,
    AuthModule
    
  ]
})

export class LessonsModule {}
