import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { 
  CreateUserDto, 
  PasswordUpdateDto, 
  VerifyEmailDto, 
  PasswordResetSaveDto, 
  PasswordResetDto, 
  LoginUserDto, 
  UpdateUserDto 
} from './dto/index';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bycrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/index';
import { EmailService } from 'src/common/services/email.service';
import { substractTime } from 'src/common/functions/substract-dates';
import { tokenGenerator } from './functions/temp-password.function';
import { sumTime } from 'src/common/functions/endDate';



@Injectable()
export class AuthService {

  constructor (

    private emailService: EmailService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) {
    
  }



  async createUser (  createUserDto: CreateUserDto ) {

    const { password,  ...userData } = createUserDto;

    const emailToken: string = tokenGenerator();

    const tokenDateExp = sumTime.sumHours( new Date(), 24 );

    const user: User = this.userRepository.create( {
      ...userData,
        password: bycrypt.hashSync( password, 10 ),
        emailToken,
        tokenDateExp

    } )

    try {

      await this.userRepository.save( user );

      await this.emailService.sendEmail( user.email, 
        'Sign up token', 
        `Your email verification token is: ${emailToken}` );

    return {

        message: 'Please check your email inbox to complete the sign up process' ,
        email: user.email,
        name: user.fullName

      };
  
      
    } catch ( error ) {
      
      this.handleDbExceptions( error );

    }

  }

async loginUser ( loginUserDto: LoginUserDto ) {

    const { email, password } = loginUserDto;

    const user: User = await this.userRepository.findOne(  { 

      where: { email },
      select: {  email: true, password: true, id: true  },

    } );

    if ( !user ) throw new UnauthorizedException(  'The email or password is incorrect' );

    if ( user.isVerified === false ) throw new UnauthorizedException( 'Your email is not verified. Please check your inbox' );

    const match: boolean = await bycrypt.compare( password, user.password );

    if ( !match ) throw new UnauthorizedException(  'The email or password is incorrect' );

    return {
      email: user.email,
      password: user.password,
      token: this.getJwtToken( { id: user.id  } ),
    };

  }



  private getJwtToken ( payload: JwtPayload ) {


  const token: string = this.jwtService.sign(  payload );

  return token;

}

async verifyEmail ( verifyEmailDto: VerifyEmailDto ) {

  const { emailToken } = verifyEmailDto;

  const user: User = await this.userRepository.findOneBy( { emailToken } );

  if  ( !user ) throw new NotFoundException( 'Token not found' );

  const isValidToken = substractTime.substractHours( user.tokenDateExp );

  if ( !isValidToken ) throw new BadRequestException( 'Token not valid' );

  user.isVerified = true;
  user.emailToken = null;
  user.tokenDateExp = null;

  try {

    await this.userRepository.save( user );

  return {
    message: "Your email has been verified",
  }
    
  } catch (error) {
    
    this.handleDbExceptions( error );

  }


}

async updateUserEmail( id: string ,updateUserDto: UpdateUserDto ) {
  
  const { tempEmail } = updateUserDto;

  const user: User = await this.userRepository.findOneBy({ id });
  if (!user) throw new BadRequestException({ message: "error" });

  if ( user.email === tempEmail ) throw new BadRequestException( 'The email is the same that the current one.' )

  user.tempEmail = tempEmail;
  user.emailToken = tokenGenerator();
  user.tokenDateExp = sumTime.sumHours( new Date(), 24 );

  try {

    await this.userRepository.save(user);

    await this.emailService.sendEmail( tempEmail, 
    'Email change request', 
    `Your email verification token is: ${user.emailToken}` );

  return {

    message: "Please verify your inbox to finish the verification process",

  }
    
  } catch (error) {
    
    this.handleDbExceptions( error );
  }

  
} 

async emailUpdateSave ( verifyEmailDto: VerifyEmailDto  ) {

  const { emailToken } = verifyEmailDto;

  const user: User = await this.userRepository.findOneBy( { emailToken } );

  if  ( !user ) throw new NotFoundException( 'Token not valid' );

  const isValidToken = substractTime.substractHours( user.tokenDateExp );

  if (  !isValidToken   ) throw new BadRequestException( 'Token not valid' );

  user.email = user.tempEmail;
  user.emailToken = null;
  user.tokenDateExp = null;
  user.tempEmail = null;

  try {

    await this.userRepository.save( user );

    await this.emailService.sendEmail( 
      user.email, 
      "Email updated", 
      "Your email has been updated"
      )
  
    return {
      message: "Your email has been updated",
    }
    
  } catch (error) {

    this.handleDbExceptions( error );
    
  }


}

async updatePassword ( id: string, passwordUpdateDto: PasswordUpdateDto ) {

  const { password } = passwordUpdateDto;

  if ( !password ) throw new BadRequestException( 'Please enter your new password' );

  const hashedPass: string = bycrypt.hashSync( password, 10 );

  const user: User = await this.userRepository.findOneBy( { id } );

  user.password = hashedPass;

  try {

  await this.userRepository.save( user );

  return {

    message: "Your password has been updated",
  }

  } catch (error) {
    
    this.handleDbExceptions( error );
  }

  

}

async passwordReset ( passwordResetDto: PasswordResetDto ) {

  const { email } = passwordResetDto;

  const user: User = await this.userRepository.findOneBy( { email } );

  if ( user ) {

    const token: string = tokenGenerator();

    user.tempPassword = token;
    user.tempPasswordExp = sumTime.sumHours( new Date(), 24 );

    await this.userRepository.save( user );

    const emailSubject: string = 'Password reset request';

    await this.emailService.sendEmail( user.email, 
      emailSubject, 
      `Your temporal password is ${ token } <br>
      <br>
      This temporal password will expire in the next 24 hours` );

  }

  return {
    message: "If your email exist you should receive a message with the next instructions ",
  }

}

async passwordResetSave ( passwordResetSaveDto: PasswordResetSaveDto ) {

  const { password, tempPassword } = passwordResetSaveDto;

  const user: User = await this.userRepository.findOneBy( { tempPassword } );

  if (!user) throw new BadRequestException('Error');

  const isValidTempPass = substractTime.substractHours( user.tempPasswordExp );

  if ( !isValidTempPass  ) throw new BadRequestException( 'Temporal password expired' );

  if ( !password ) throw new BadRequestException( 'Please enter your new password' );

  const hashedPass: string = bycrypt.hashSync( password, 10 );

  

  user.password = hashedPass;
  user.tempPassword = null;
  user.tempPasswordExp = null;

  await this.userRepository.save( user );

  await this.emailService.sendEmail( 
    user.email, 
    "Password reset", 
    "Your password has been restored"
    )

  return {
    message: "Your password has been updated",
  }

}



  /////////////


  private handleDbExceptions (error : any) {

    if (error.code === '23505') throw new BadRequestException(error.detail);
  
    console.log( error );

    throw new InternalServerErrorException("Unexpected error. Check server logs");
  
  }

}


