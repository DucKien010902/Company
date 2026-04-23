import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ALL_PERMISSIONS } from '../../common/constants/permission-catalog';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuditService } from '../audit/audit.service';
import { normalizeKeyword } from '../../common/utils/slug.util';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateRoleDto, performedByAccountId?: string) {
    this.validatePermissions(dto.permissions);

    const existingRole = await this.roleModel.exists({ key: dto.key.toLowerCase() });
    if (existingRole) {
      throw new BadRequestException('Role key already exists');
    }

    const role = await this.roleModel.create({
      ...dto,
      key: normalizeKeyword(dto.key).replace(/\s+/g, '-'),
    });

    await this.auditService.log({
      action: 'create_role',
      module: 'iam',
      entityName: 'Role',
      entityId: String(role._id),
      performedByAccountId,
      metadata: { name: role.name },
    });

    return role;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();

    const filter = search
      ? {
          $or: [
            { key: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.roleModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      this.roleModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).lean();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto, performedByAccountId?: string) {
    if (dto.permissions) {
      this.validatePermissions(dto.permissions);
    }

    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem && dto.isSystem === false) {
      throw new BadRequestException('System role cannot be demoted directly');
    }

    Object.assign(role, dto);
    if (dto.key) {
      role.key = normalizeKeyword(dto.key).replace(/\s+/g, '-');
    }

    await role.save();

    await this.auditService.log({
      action: 'update_role',
      module: 'iam',
      entityName: 'Role',
      entityId: String(role._id),
      performedByAccountId,
      metadata: { name: role.name },
    });

    return role;
  }

  async remove(id: string, performedByAccountId?: string) {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new BadRequestException('System role cannot be deleted');
    }

    await role.deleteOne();

    await this.auditService.log({
      action: 'delete_role',
      module: 'iam',
      entityName: 'Role',
      entityId: String(id),
      performedByAccountId,
      metadata: { name: role.name },
    });

    return { success: true };
  }

  private validatePermissions(permissions: string[]) {
  const allowedPermissions = new Set<string>(ALL_PERMISSIONS as readonly string[]);
  const invalid = permissions.filter((permission) => !allowedPermissions.has(permission));

  if (invalid.length) {
    throw new BadRequestException(`Invalid permissions: ${invalid.join(', ')}`);
  }
}
}
