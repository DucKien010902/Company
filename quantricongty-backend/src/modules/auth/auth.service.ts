import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { StringValue } from 'ms';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Account, AccountDocument, AccountStatus } from './schemas/account.schema';
import { Role, RoleDocument } from '../iam/schemas/role.schema';
import { Company, CompanyDocument } from '../company/schemas/company.schema';
import { Employee, EmployeeDocument, WorkStatus } from '../hrm/schemas/employee.schema';
import { LoginDto } from './dto/login.dto';
import { BootstrapOwnerDto } from './dto/bootstrap-owner.dto';
import { comparePassword, hashPassword } from '../../common/utils/password.util';
import { ALL_PERMISSIONS } from '../../common/constants/permission-catalog';
import { normalizeKeyword } from '../../common/utils/slug.util';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async bootstrapOwner(dto: BootstrapOwnerDto) {
    const hasCompany = await this.companyModel.exists({});
    const hasAccount = await this.accountModel.exists({});

    if (hasCompany || hasAccount) {
      throw new BadRequestException(
        'System was already bootstrapped. Use login instead.',
      );
    }

    const company = await this.companyModel.create({
      ...dto.company,
      timezone: 'Asia/Bangkok',
      currency: 'VND',
    });

    const ownerRole = await this.roleModel.create({
      key: 'owner',
      name: 'Owner',
      description: 'Highest system administrator role',
      permissions: ALL_PERMISSIONS,
      isSystem: true,
    });

    const passwordHash = await hashPassword(
      dto.owner.password,
      this.configService.get<number>('app.bcryptRounds') ?? 10,
    );

    const account = await this.accountModel.create({
      email: dto.owner.email.toLowerCase(),
      phone: dto.owner.phone,
      passwordHash,
      roleIds: [ownerRole._id],
      status: AccountStatus.ACTIVE,
    });

    const employee = await this.employeeModel.create({
      employeeCode: 'EMP-0001',
      fullName: dto.owner.fullName,
      normalizedFullName: normalizeKeyword(dto.owner.fullName),
      email: dto.owner.email.toLowerCase(),
      phone: dto.owner.phone,
      accountId: account._id,
      employmentType: 'owner',
      workStatus: WorkStatus.ACTIVE,
      hireDate: new Date(),
    });

    await this.auditService.log({
      action: 'bootstrap_owner',
      module: 'auth',
      entityName: 'Account',
      entityId: String(account._id),
      performedByAccountId: String(account._id),
      metadata: {
        companyId: String(company._id),
        employeeId: String(employee._id),
      },
    });

    return this.issueToken(account.email, [ownerRole], String(account._id));
  }

  async login(dto: LoginDto) {
    const account = await this.accountModel.findOne({ email: dto.email.toLowerCase() });

    if (!account) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isMatched = await comparePassword(dto.password, account.passwordHash);
    if (!isMatched) {
      throw new UnauthorizedException('Wrong email or password');
    }

    account.lastLoginAt = new Date();
    await account.save();

    const roles = await this.roleModel.find({ _id: { $in: account.roleIds } });
    return this.issueToken(account.email, roles, String(account._id));
  }

  getPermissionCatalog() {
    return ALL_PERMISSIONS;
  }

  private async issueToken(email: string, roles: RoleDocument[], accountId?: string) {
  const deduplicatedPermissions = Array.from(
    new Set(roles.flatMap((role) => role.permissions)),
  );

  const sub = accountId ?? '';
  const roleIds = roles.map((role) => String(role._id));
  const jwtSecret =
    this.configService.get<string>('app.jwtAccessSecret') ?? 'change_me_access_secret';
  const jwtExpiresIn =
    (this.configService.get<string>('app.jwtAccessExpiresIn') ?? '1d') as StringValue;

  const accessToken = await this.jwtService.signAsync(
    {
      sub,
      email,
      permissions: deduplicatedPermissions,
      roleIds,
    },
    {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    },
  );

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: jwtExpiresIn,
    permissions: deduplicatedPermissions,
    roleIds,
  };
}
}
