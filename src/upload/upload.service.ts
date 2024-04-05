import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { tokenGenerator } from 'src/auth/functions/temp-password.function';
import { sumTime } from 'src/common/functions/endDate';
import { DocumentService } from 'src/document/document.service';
import { Document } from 'src/document/entities/document.entity';
import { Repository } from 'typeorm';




@Injectable()
export class UploadService {

private s3: AWS.S3

constructor (


  private configService: ConfigService,
  private readonly documentService: DocumentService,
  @InjectRepository(Document)
  private documentRepository: Repository<Document>

) {

  this.s3 = new AWS.S3( { 

    accessKeyId: this.configService.get( 'ACCESS_KEY_ID' ),
    secretAccessKey: this.configService.get( 'SECRET_ACCESS_KEY' ),
    region: this.configService.get( 'S3_REGION' ),

} );
}

async uploadHealthFile (dni:number, file: Express.Multer.File): Promise<Object> {

  const document: Document = await this.documentService.findOne( dni );

  const bucketName = this.configService.get( 'S3_BUCKET_NAME' );

  let { buffer, originalname } = file;

  const fileExtension = originalname.split('.').pop();

  const filename = tokenGenerator();

  let key = `${dni}/${filename}.${fileExtension}`;

  const uploadResult = await this.s3.upload( {

    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ACL: 'public-read'

  } ).promise();

  const url = `https://${bucketName}.s3.${this.configService.get('S3_REGION')}.amazonaws.com/${key}`;

  const currentDate = new Date();

  document.url = url;
  document.startDate = currentDate;
  document.endDate = sumTime.sumMonths( currentDate, 12 )

  await this.documentRepository.save( document );

  return {
    
    file: document,
    
  };

}

async getFileUrlByDni(dni: string): Promise<string[]> {
  const bucketName = this.configService.get('S3_BUCKET_NAME');
  const s3Region = this.configService.get('S3_REGION');

  const listObjectsResponse = await this.s3.listObjectsV2({
    Bucket: bucketName,
    Prefix: `${dni}/`
  }).promise();

  const urls = listObjectsResponse.Contents.map(object => {
    return `https://${bucketName}.s3.${s3Region}.amazonaws.com/${object.Key}`;
  });

  return urls;
}
  
}
