import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(payload: {
    action: string;
    module: string;
    entityName?: string;
    entityId?: string;
    performedByAccountId?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.auditLogModel.create({
      ...payload,
      metadata: payload.metadata ?? {},
    });
  }

  async findLatest(limit = 50) {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}
