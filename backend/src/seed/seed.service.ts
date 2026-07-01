import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../auth/admin.schema';
import { hashPassword, verifyPassword } from '../auth/password.util';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly menuService: MenuService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedAdmin();
    await this.menuService.ensureDefaultMenu();
    await this.syncDevelopmentMenuDefaults();
  }

  private async seedAdmin(): Promise<void> {
    const email = this.configService.get<string>('ADMIN_SEED_EMAIL');
    const password = this.configService.get<string>('ADMIN_SEED_PASSWORD');

    if (!email || !password) {
      this.logger.warn('ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD is missing. Admin seed skipped.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingAdmin = await this.adminModel.findOne({ email: normalizedEmail }).exec();
    if (existingAdmin) {
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        const passwordMatches = await verifyPassword(password, existingAdmin.passwordHash);
        if (!passwordMatches) {
          existingAdmin.passwordHash = await hashPassword(password);
          await existingAdmin.save();
          this.logger.log(`Development admin password refreshed for ${normalizedEmail}.`);
        }
      }

      return;
    }

    await this.adminModel.create({
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      role: 'admin'
    });

    this.logger.log(`Admin seed created for ${normalizedEmail}.`);
  }

  private async syncDevelopmentMenuDefaults(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      return;
    }

    const changed = await this.menuService.syncMissingDefaultContent();
    if (changed) {
      this.logger.log('Development menu defaults synchronized without overwriting existing items.');
    }
  }
}
