import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(  

    private readonly reflector: Reflector

  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles: string [] = this.reflector.get( META_ROLES, context.getHandler() );

    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if ( !user ) throw new InternalServerErrorException( 'User not found' );

    for ( const role of user.roles ){

      if ( validRoles.includes( role ) ) return true;


    }

    throw new 
      UnauthorizedException( `User ${ user.email } needs a valid role` );
  }




}
