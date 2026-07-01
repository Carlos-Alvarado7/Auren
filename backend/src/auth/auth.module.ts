import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { LoginRateLimitService } from './login-rate-limit.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard, LoginRateLimitService],
  exports: [AuthService, AdminAuthGuard, MongooseModule]
})
export class AuthModule {}

