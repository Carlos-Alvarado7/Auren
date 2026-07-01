import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validateEnvironment } from './config/validate-environment';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { AuditModule } from './audit/audit.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['backend/.env', '.env'],
      validate: validateEnvironment
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DB_NAME', 'Auren'),
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10
      })
    }),
    AuditModule,
    AuthModule,
    MenuModule,
    SeedModule
  ]
})
export class AppModule {}

