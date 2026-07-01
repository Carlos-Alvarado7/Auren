import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedAdmin } from './auth.types';

interface RequestWithAdmin extends Request {
  admin?: AuthenticatedAdmin;
  signedCookies: Record<string, string | undefined>;
  cookies: Record<string, string | undefined>;
}

const SESSION_COOKIE = 'auren_session';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const token = request.signedCookies?.[SESSION_COOKIE] ?? request.cookies?.[SESSION_COOKIE];
    const admin = await this.authService.verifySessionToken(token);

    if (!admin) {
      throw new UnauthorizedException('Sesión requerida.');
    }

    request.admin = admin;
    return true;
  }
}

export function getAuthenticatedAdmin(request: Request): AuthenticatedAdmin {
  return (request as RequestWithAdmin).admin as AuthenticatedAdmin;
}

