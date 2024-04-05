import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  imports: [ 
    TypeOrmModule.forFeature( 
      [Payment] 
      
      ),
      ClientsModule,
      CommonModule,
      AuthModule,
      
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [ PaymentsService ]
})
export class PaymentsModule {}
