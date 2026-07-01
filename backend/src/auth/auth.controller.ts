import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AdminAuthGuard, getAuthenticatedAdmin } from './admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ admin: { email: string; role: 'admin' } }> {
    const admin = await this.authService.validateLogin(loginDto.email, loginDto.password, request.ip);
    this.authService.setSessionCookie(response, admin);

    return { admin: { email: admin.email, role: admin.role } };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): { ok: true } {
    this.authService.clearSessionCookie(response);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(AdminAuthGuard)
  me(@Req() request: Request): { admin: { email: string; role: 'admin' } } {
    const admin = getAuthenticatedAdmin(request);
    return { admin: { email: admin.email, role: admin.role } };
  }
}

