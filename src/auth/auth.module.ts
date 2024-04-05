import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailService } from 'src/common/services/email.service';



@Module({
  imports:[TypeOrmModule.forFeature( 
    [User] 
    
    ),  
    
    PassportModule.register( { defaultStrategy: 'jwt', } ), 
    
    JwtModule.registerAsync( {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (  configService: ConfigService ) => {

        return {

          secret: configService.get('JWT_SECRET'),
          signOptions : {
          expiresIn: '1h'

        }

      }
    }
  }),

  ConfigModule,
    
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
