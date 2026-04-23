import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrgUnit, OrgUnitDocument } from './schemas/org-unit.schema';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { UpdateOrgUnitDto } from './dto/update-org-unit.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class OrgUnitsService {
  constructor(
    @InjectModel(OrgUnit.name)
    private readonly orgUnitModel: Model<OrgUnitDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateOrgUnitDto, performedByAccountId?: string) {
    const exists = await this.orgUnitModel.exists({ code: dto.code.toUpperCase() });
    if (exists) {
      throw new BadRequestException('Org unit code already exists');
    }

    const orgUnit = await this.orgUnitModel.create({
      ...dto,
      code: dto.code.toUpperCase(),
    });

    await this.auditService.log({
      action: 'create_org_unit',
      module: 'org',
      entityName: 'OrgUnit',
      entityId: String(orgUnit._id),
      performedByAccountId,
      metadata: { code: orgUnit.code, name: orgUnit.name },
    });

    return orgUnit;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const filter = search
      ? { $or: [{ code: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] }
      : {};

    const [items, total] = await Promise.all([
      this.orgUnitModel
        .find(filter)
        .populate('parentId')
        .populate('branchId')
        .populate('managerEmployeeId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.orgUnitModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const orgUnit = await this.orgUnitModel
      .findById(id)
      .populate('parentId')
      .populate('branchId')
      .populate('managerEmployeeId')
      .lean();

    if (!orgUnit) throw new NotFoundException('Org unit not found');
    return orgUnit;
  }

  async update(id: string, dto: UpdateOrgUnitDto, performedByAccountId?: string) {
    const orgUnit = await this.orgUnitModel.findByIdAndUpdate(
      id,
      dto.code ? { ...dto, code: dto.code.toUpperCase() } : dto,
      { new: true },
    );

    if (!orgUnit) throw new NotFoundException('Org unit not found');

    await this.auditService.log({
      action: 'update_org_unit',
      module: 'org',
      entityName: 'OrgUnit',
      entityId: String(orgUnit._id),
      performedByAccountId,
      metadata: { code: orgUnit.code, name: orgUnit.name },
    });

    return orgUnit;
  }

  async remove(id: string, performedByAccountId?: string) {
    const hasChildren = await this.orgUnitModel.exists({ parentId: id });
    if (hasChildren) {
      throw new BadRequestException('Cannot delete org unit that still has children');
    }

    const orgUnit = await this.orgUnitModel.findByIdAndDelete(id);
    if (!orgUnit) throw new NotFoundException('Org unit not found');

    await this.auditService.log({
      action: 'delete_org_unit',
      module: 'org',
      entityName: 'OrgUnit',
      entityId: String(id),
      performedByAccountId,
      metadata: { code: orgUnit.code, name: orgUnit.name },
    });

    return { success: true };
  }
}
