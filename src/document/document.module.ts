import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [
    TypeOrmModule.forFeature( 
    [Document]),
    ClientsModule,
    AuthModule
  ],
 
  exports: [TypeOrmModule, DocumentService ]

})
export class DocumentModule {}
