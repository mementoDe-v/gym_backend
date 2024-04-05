import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1')
  
  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

    const config = new DocumentBuilder()
    .setTitle('Gym backend RESTFul API')
    .setDescription('Gym system')
    .setVersion('1.0')
    .addBearerAuth( { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token' )
    .addTag( 'Clients' )
    .addTag( 'Client health document' )
    .addTag( 'Lessons' )
    .addTag( 'Payments' )
    .addTag( 'File upload' )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);


}
bootstrap();
