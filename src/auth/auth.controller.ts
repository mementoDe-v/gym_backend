import { Controller, Post, Body, Patch, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  CreateUserDto, 
  PasswordUpdateDto,
  VerifyEmailDto,
  PasswordResetSaveDto,
  PasswordResetDto,
  LoginUserDto,
  UpdateUserDto,
  ResendEmailDto
  } from './dto/index';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';



@ApiTags( 'Auth' )
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


@ApiOperation({ 
    summary: 'User sign up',})
  @ApiResponse( { 
    status: 201, 
    description: 'User created',
    schema: {
      example: {
        message: 'Please check your email inbox to complete the sign up process' ,
        username: 'john_doe',
        email: 'john_doe@example.com',
      }
    }
  } )
  @ApiResponse( { status: 400, description: 'Bad request' } )

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ 
    summary: 'User sign in',})
    @ApiResponse( { 
      status: 201, 
      description: 'User logged',
      schema: {
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjllMDFiMWRjLWY0M2MtNDk0MC05YTdkLTViOGVmNjExNjQyZiIsImlhdCI6MTcxMjE2MTc5OSwiZXhwIjoxNzEyMTY1Mzk5fQ.XWh0Sdgj9mEkFstiha6UEJG3PgDL6TjWprLIZW_HqeY'
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.loginUser(loginUserDto);
  }


  @ApiOperation({ 
    summary: 'Email verification',})
    @ApiResponse( { 
      status: 201, 
      description: 'Email verified',
      schema: {
        example: {
          message: "Your email has been verified",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )

  @Get('verify-email')
  async verifyEmail ( @Query() verifyEmailDto: VerifyEmailDto, ) {
    return this.authService.verifyEmail( verifyEmailDto );
  }

  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Email update (User authenticated)',
    description: 'This enpoint update user email. The user must be authenticated'  
  })
    @ApiResponse( { 
      status: 201, 
      description: 'Email verified',
      schema: {
        example: {
          message: "Please verify your inbox to finish the verification process",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch('update-email')
  @Auth( ValidRoles.user, ValidRoles.admin, ValidRoles.superUser )
  updateUserEmail ( 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') user: User
    ) {
    return this.authService.updateUserEmail(user.id ,updateUserDto);
  }

  @ApiOperation({ 
    summary: 'Email update verification',  
  })
    @ApiResponse( { 
      status: 201, 
      description: 'Email verified',
      schema: {
        example: {
          message: "Your email has been updated",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )


  @Patch('verify-email/update')
  async emailUpdateSave ( @Body() verifyEmailDto: VerifyEmailDto, ) {
    return this.authService.emailUpdateSave( verifyEmailDto );
  }


  @ApiBearerAuth( 'access-token' )
  @ApiOperation({ 
    summary: 'Password update (User authenticated)',
    description: 'This enpoint update user password. The user must be authenticated',
      
  })
    @ApiResponse( { 
      status: 201, 
      description: 'Password updated',
      schema: {
        example: {
          message: "Your password has been updated",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )
  @ApiResponse( { status: 401, description: 'Unauthorized' } )

  @Patch('update-password')
  @Auth( ValidRoles.user, ValidRoles.admin, ValidRoles.superUser )
  updatePassword ( 
    @Body() passwordUpdateDto: PasswordUpdateDto,
    @GetUser('id') user: User
    ) {
    return this.authService.updatePassword( user.id, passwordUpdateDto );
  }

  @ApiOperation({ 
    summary: 'Password reset',
    description: 'This enpoint reset user password.',
      
  })
    @ApiResponse( { 
      status: 201, 
      description: 'Password reset instructions sent',
      schema: {
        example: {
          message: "If your email exist you should receive a message with the next instructions ",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )

  @Patch('password-reset')
  passwordReset( @Body() passwordResetDto: PasswordResetDto ) {

    return this.authService.passwordReset( passwordResetDto );

  }

  @ApiOperation({ 
    summary: 'Password reset save',
    description: 'This enpoint save the new user password after reset request',
      
  })
    @ApiResponse( { 
      status: 201, 
      description: 'Password updated',
      schema: {
        example: {
          message: "Your password has been updated",
        }
      }
    } )
  @ApiResponse( { status: 400, description: 'Bad request' } )

  @Patch( 'password-reset/save' )
  passwordResetSave (
    @Body() passwordResetSaveDto: PasswordResetSaveDto) {
      return this.authService.passwordResetSave( passwordResetSaveDto );
    }



    @Post('verify-email/resend')
    reresendEmailUrlVerification(  @Body() resendEmailDto:ResendEmailDto ) {

    return this.authService.resendEmailUrlVerification( resendEmailDto );

    }

}
