import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { DocumentModule } from 'src/document/document.module';
import { Document } from 'src/document/entities/document.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    TypeOrmModule.forFeature( 
    [ Document ]),
    CommonModule,
    DocumentModule,
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class UploadModule {}
