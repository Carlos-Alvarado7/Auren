import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginRateLimitService } from './login-rate-limit.service';

describe('AuthService', () => {
  it('sets a signed session cookie with a jwt token', () => {
    const service = new AuthService(
      {} as never,
      {
        getOrThrow: () => 'test-jwt-secret',
        get: (key: string) => (key === 'NODE_ENV' ? 'development' : undefined)
      } as unknown as ConfigService,
      {} as LoginRateLimitService
    );
    const response = {
      cookie: jest.fn()
    };

    service.setSessionCookie(response as never, {
      id: 'admin-id',
      email: 'admin@auren.local',
      role: 'admin'
    });

    expect(response.cookie).toHaveBeenCalledWith(
      'auren_session',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        signed: true,
        sameSite: 'lax',
        path: '/'
      })
    );
  });
});
