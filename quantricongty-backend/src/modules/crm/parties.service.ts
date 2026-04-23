import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExternalParty, ExternalPartyDocument } from './schemas/external-party.schema';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuditService } from '../audit/audit.service';
import { normalizeKeyword } from '../../common/utils/slug.util';

@Injectable()
export class PartiesService {
  constructor(
    @InjectModel(ExternalParty.name)
    private readonly externalPartyModel: Model<ExternalPartyDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreatePartyDto, performedByAccountId?: string) {
    const exists = await this.externalPartyModel.exists({ code: dto.code.toUpperCase() });
    if (exists) {
      throw new BadRequestException('Party code already exists');
    }

    const party = await this.externalPartyModel.create({
      ...dto,
      code: dto.code.toUpperCase(),
      normalizedDisplayName: normalizeKeyword(dto.displayName),
      emails: dto.emails?.map((email) => email.toLowerCase()) ?? [],
      phones: dto.phones ?? [],
      addresses: dto.addresses ?? [],
      assignedEmployeeIds: dto.assignedEmployeeIds ?? [],
      tags: dto.tags ?? [],
    });

    await this.auditService.log({
      action: 'create_party',
      module: 'crm',
      entityName: 'ExternalParty',
      entityId: String(party._id),
      performedByAccountId,
      metadata: { code: party.code, displayName: party.displayName },
    });

    return party;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const normalizedSearch = normalizeKeyword(query.search);
    const filter = normalizedSearch
      ? {
          $or: [
            { displayName: { $regex: query.search, $options: 'i' } },
            { normalizedDisplayName: { $regex: normalizedSearch, $options: 'i' } },
            { code: { $regex: query.search, $options: 'i' } },
            { emails: { $regex: query.search, $options: 'i' } },
            { phones: { $regex: query.search, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.externalPartyModel
        .find(filter)
        .populate('ownerEmployeeId')
        .populate('assignedEmployeeIds')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.externalPartyModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const party = await this.externalPartyModel
      .findById(id)
      .populate('ownerEmployeeId')
      .populate('assignedEmployeeIds')
      .lean();

    if (!party) {
      throw new NotFoundException('Party not found');
    }

    return party;
  }

  async update(id: string, dto: UpdatePartyDto, performedByAccountId?: string) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.code) payload.code = dto.code.toUpperCase();
    if (dto.displayName) payload.normalizedDisplayName = normalizeKeyword(dto.displayName);
    if (dto.emails) payload.emails = dto.emails.map((email) => email.toLowerCase());

    const party = await this.externalPartyModel.findByIdAndUpdate(id, payload, { new: true });
    if (!party) throw new NotFoundException('Party not found');

    await this.auditService.log({
      action: 'update_party',
      module: 'crm',
      entityName: 'ExternalParty',
      entityId: String(party._id),
      performedByAccountId,
      metadata: { code: party.code, displayName: party.displayName },
    });

    return party;
  }

  async remove(id: string, performedByAccountId?: string) {
    const party = await this.externalPartyModel.findByIdAndDelete(id);
    if (!party) throw new NotFoundException('Party not found');

    await this.auditService.log({
      action: 'delete_party',
      module: 'crm',
      entityName: 'ExternalParty',
      entityId: String(id),
      performedByAccountId,
      metadata: { code: party.code, displayName: party.displayName },
    });

    return { success: true };
  }
}
