import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { LoginRateLimitService } from './login-rate-limit.service';
import { AuthenticatedAdmin, SessionPayload } from './auth.types';
import { verifyPassword } from './password.util';

const SESSION_COOKIE = 'auren_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly loginRateLimitService: LoginRateLimitService
  ) {}

  async validateLogin(email: string, password: string, ipAddress: string | undefined): Promise<AuthenticatedAdmin> {
    const key = `${ipAddress ?? 'unknown'}:${email}`;
    this.loginRateLimitService.assertAllowed(key);

    const admin = await this.adminModel.findOne({ email }).exec();
    const validPassword = admin ? await verifyPassword(password, admin.passwordHash) : false;

    if (!admin || !validPassword) {
      this.loginRateLimitService.recordFailure(key);
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    this.loginRateLimitService.recordSuccess(key);
    return this.toAuthenticatedAdmin(admin);
  }

  setSessionCookie(response: Response, admin: AuthenticatedAdmin): void {
    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: '8h' }
    );

    response.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      signed: true,
      sameSite: 'lax',
      maxAge: SESSION_TTL_MS,
      path: '/'
    });
  }

  clearSessionCookie(response: Response): void {
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      signed: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  async verifySessionToken(token: string | undefined): Promise<AuthenticatedAdmin | null> {
    if (!token) {
      return null;
    }

    try {
      const payload = jwt.verify(token, this.configService.getOrThrow<string>('JWT_SECRET')) as SessionPayload;
      const admin = await this.adminModel.findById(payload.sub).exec();

      if (!admin || admin.email !== payload.email || admin.role !== payload.role) {
        return null;
      }

      return this.toAuthenticatedAdmin(admin);
    } catch {
      return null;
    }
  }

  private toAuthenticatedAdmin(admin: AdminDocument): AuthenticatedAdmin {
    return {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role
    };
  }
}
