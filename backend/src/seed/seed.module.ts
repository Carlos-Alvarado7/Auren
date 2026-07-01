import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MenuModule } from '../menu/menu.module';
import { SeedService } from './seed.service';

@Module({
  imports: [AuthModule, MenuModule],
  providers: [SeedService]
})
export class SeedModule {}

