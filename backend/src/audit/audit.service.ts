import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';

interface AuditInput {
  action: string;
  actorEmail: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLog>) {}

  async record(input: AuditInput): Promise<void> {
    try {
      await this.auditLogModel.create({
        action: input.action,
        actorEmail: input.actorEmail,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ?? {}
      });
    } catch (error) {
      this.logger.warn(`Audit log write failed for action ${input.action}`);
    }
  }
}

