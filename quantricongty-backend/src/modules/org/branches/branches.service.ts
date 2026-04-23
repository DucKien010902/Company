import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateBranchDto, performedByAccountId?: string) {
    const exists = await this.branchModel.exists({ code: dto.code.toUpperCase() });
    if (exists) {
      throw new BadRequestException('Branch code already exists');
    }

    const branch = await this.branchModel.create({
      ...dto,
      code: dto.code.toUpperCase(),
    });

    await this.auditService.log({
      action: 'create_branch',
      module: 'org',
      entityName: 'Branch',
      entityId: String(branch._id),
      performedByAccountId,
      metadata: { code: branch.code, name: branch.name },
    });

    return branch;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = query.search?.trim();
    const filter = search
      ? { $or: [{ code: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] }
      : {};

    const [items, total] = await Promise.all([
      this.branchModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      this.branchModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).lean();
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, performedByAccountId?: string) {
    const branch = await this.branchModel.findByIdAndUpdate(
      id,
      dto.code ? { ...dto, code: dto.code.toUpperCase() } : dto,
      { new: true },
    );

    if (!branch) throw new NotFoundException('Branch not found');

    await this.auditService.log({
      action: 'update_branch',
      module: 'org',
      entityName: 'Branch',
      entityId: String(branch._id),
      performedByAccountId,
      metadata: { code: branch.code, name: branch.name },
    });

    return branch;
  }

  async remove(id: string, performedByAccountId?: string) {
    const branch = await this.branchModel.findByIdAndDelete(id);
    if (!branch) throw new NotFoundException('Branch not found');

    await this.auditService.log({
      action: 'delete_branch',
      module: 'org',
      entityName: 'Branch',
      entityId: String(id),
      performedByAccountId,
      metadata: { code: branch.code, name: branch.name },
    });

    return { success: true };
  }
}
