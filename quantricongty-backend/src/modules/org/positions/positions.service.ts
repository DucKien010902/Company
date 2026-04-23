import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Position, PositionDocument } from './schemas/position.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { AuditService } from '../../audit/audit.service';
import { Role, RoleDocument } from '../../iam/schemas/role.schema';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreatePositionDto, performedByAccountId?: string) {
    const exists = await this.positionModel.exists({ code: dto.code.toUpperCase() });
    if (exists) throw new BadRequestException('Position code already exists');

    const defaultRoleIds = await this.normalizeAndValidateRoleIds(dto.defaultRoleIds);

    const position = await this.positionModel.create({
      ...dto,
      code: dto.code.toUpperCase(),
      defaultRoleIds,
    });

    await this.auditService.log({
      action: 'create_position',
      module: 'org',
      entityName: 'Position',
      entityId: String(position._id),
      performedByAccountId,
      metadata: { code: position.code, name: position.name },
    });

    return position;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const filter = search
      ? { $or: [{ code: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] }
      : {};

    const [items, total] = await Promise.all([
      this.positionModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      this.positionModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const position = await this.positionModel.findById(id).lean();
    if (!position) throw new NotFoundException('Position not found');
    return position;
  }

  async update(id: string, dto: UpdatePositionDto, performedByAccountId?: string) {
    const defaultRoleIds =
      dto.defaultRoleIds === undefined
        ? undefined
        : await this.normalizeAndValidateRoleIds(dto.defaultRoleIds);

    const position = await this.positionModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.code ? { code: dto.code.toUpperCase() } : {}),
        ...(defaultRoleIds !== undefined ? { defaultRoleIds } : {}),
      },
      { new: true },
    );

    if (!position) throw new NotFoundException('Position not found');

    await this.auditService.log({
      action: 'update_position',
      module: 'org',
      entityName: 'Position',
      entityId: String(position._id),
      performedByAccountId,
      metadata: { code: position.code, name: position.name },
    });

    return position;
  }

  async remove(id: string, performedByAccountId?: string) {
    const position = await this.positionModel.findByIdAndDelete(id);
    if (!position) throw new NotFoundException('Position not found');

    await this.auditService.log({
      action: 'delete_position',
      module: 'org',
      entityName: 'Position',
      entityId: String(id),
      performedByAccountId,
      metadata: { code: position.code, name: position.name },
    });

    return { success: true };
  }

  private async normalizeAndValidateRoleIds(roleIds?: string[]) {
    if (!roleIds?.length) {
      return [];
    }

    const normalizedRoleIds = Array.from(new Set(roleIds.map((roleId) => roleId.trim())));
    const existingRoles = await this.roleModel.countDocuments({ _id: { $in: normalizedRoleIds } });

    if (existingRoles !== normalizedRoleIds.length) {
      throw new BadRequestException('One or more default roles are invalid');
    }

    return normalizedRoleIds;
  }
}
