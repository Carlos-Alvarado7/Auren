import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface LoginBucket {
  attempts: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

@Injectable()
export class LoginRateLimitService {
  private readonly buckets = new Map<string, LoginBucket>();

  assertAllowed(key: string): void {
    const bucket = this.getBucket(key);

    if (bucket.attempts >= MAX_ATTEMPTS) {
      const retrySeconds = Math.ceil((bucket.resetAt - Date.now()) / 1000);
      throw new HttpException(
        `Demasiados intentos. Intente de nuevo en ${retrySeconds} segundos.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }

  recordFailure(key: string): void {
    const bucket = this.getBucket(key);
    bucket.attempts += 1;
    this.buckets.set(key, bucket);
  }

  recordSuccess(key: string): void {
    this.buckets.delete(key);
  }

  private getBucket(key: string): LoginBucket {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (existing && existing.resetAt > now) {
      return existing;
    }

    const freshBucket = { attempts: 0, resetAt: now + WINDOW_MS };
    this.buckets.set(key, freshBucket);
    return freshBucket;
  }
}
