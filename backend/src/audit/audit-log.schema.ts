import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ required: true, trim: true, maxlength: 120 })
  action: string;

  @Prop({ required: true, trim: true, lowercase: true, maxlength: 180 })
  actorEmail: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  entityType: string;

  @Prop({ trim: true, maxlength: 120 })
  entityId?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

