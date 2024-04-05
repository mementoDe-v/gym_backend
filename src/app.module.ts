import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { CommonModule } from './common/common.module';
import { DocumentModule } from './document/document.module';
import { UploadModule } from './upload/upload.module';
import { LessonsModule } from './lessons/lessons.module';
import { ScheduleTaskModule } from './schedule/scheduleTask.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PaymentsModule } from './payments/payments.module';






@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    TypeOrmModule.forRoot({
        ssl: process.env.STAGE === 'prod',
        extra: {
          ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null
        },
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,


    }),
    ClientsModule,
    CommonModule,
    DocumentModule,
    UploadModule,
    LessonsModule,
    ScheduleTaskModule,
    AuthModule,
    PaymentsModule,


  ],
  providers: [

  {
    provide: APP_GUARD,
      useClass: ThrottlerGuard
  },

  ]
})
export class AppModule {}
