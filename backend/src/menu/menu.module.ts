import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { Menu, MenuSchema } from './menu.schema';
import { AdminMenuController, PublicMenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]), AuditModule, AuthModule],
  controllers: [PublicMenuController, AdminMenuController],
  providers: [MenuService],
  exports: [MenuService, MongooseModule]
})
export class MenuModule {}
