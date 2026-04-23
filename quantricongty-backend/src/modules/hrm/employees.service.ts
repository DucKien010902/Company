import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuditService } from '../audit/audit.service';
import { normalizeKeyword } from '../../common/utils/slug.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateEmployeeDto, performedByAccountId?: string) {
    const exists = await this.employeeModel.exists({ employeeCode: dto.employeeCode.toUpperCase() });
    if (exists) {
      throw new BadRequestException('Employee code already exists');
    }

    const employee = await this.employeeModel.create({
      ...dto,
      employeeCode: dto.employeeCode.toUpperCase(),
      normalizedFullName: normalizeKeyword(dto.fullName),
      email: dto.email?.toLowerCase(),
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      leaveDate: dto.leaveDate ? new Date(dto.leaveDate) : undefined,
    });

    await this.auditService.log({
      action: 'create_employee',
      module: 'hrm',
      entityName: 'Employee',
      entityId: String(employee._id),
      performedByAccountId,
      metadata: { employeeCode: employee.employeeCode, fullName: employee.fullName },
    });

    return employee;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const search = normalizeKeyword(query.search);
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: query.search, $options: 'i' } },
            { normalizedFullName: { $regex: search, $options: 'i' } },
            { employeeCode: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
            { phone: { $regex: query.search, $options: 'i' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.employeeModel
        .find(filter)
        .populate('branchId')
        .populate('orgUnitId')
        .populate('positionId')
        .populate('managerEmployeeId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.employeeModel.countDocuments(filter),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const employee = await this.employeeModel
      .findById(id)
      .populate('accountId')
      .populate('branchId')
      .populate('orgUnitId')
      .populate('positionId')
      .populate('managerEmployeeId')
      .lean();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto, performedByAccountId?: string) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.employeeCode) payload.employeeCode = dto.employeeCode.toUpperCase();
    if (dto.fullName) payload.normalizedFullName = normalizeKeyword(dto.fullName);
    if (dto.email) payload.email = dto.email.toLowerCase();
    if (dto.dateOfBirth) payload.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.hireDate) payload.hireDate = new Date(dto.hireDate);
    if (dto.leaveDate) payload.leaveDate = new Date(dto.leaveDate);

    const employee = await this.employeeModel.findByIdAndUpdate(id, payload, { new: true });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.auditService.log({
      action: 'update_employee',
      module: 'hrm',
      entityName: 'Employee',
      entityId: String(employee._id),
      performedByAccountId,
      metadata: { employeeCode: employee.employeeCode, fullName: employee.fullName },
    });

    return employee;
  }

  async remove(id: string, performedByAccountId?: string) {
    const employee = await this.employeeModel.findByIdAndDelete(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.auditService.log({
      action: 'delete_employee',
      module: 'hrm',
      entityName: 'Employee',
      entityId: String(id),
      performedByAccountId,
      metadata: { employeeCode: employee.employeeCode, fullName: employee.fullName },
    });

    return { success: true };
  }
}
