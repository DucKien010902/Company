export type PermissionKey =
  | 'company.read'
  | 'company.update'
  | 'roles.read'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'branches.read'
  | 'branches.create'
  | 'branches.update'
  | 'branches.delete'
  | 'orgUnits.read'
  | 'orgUnits.create'
  | 'orgUnits.update'
  | 'orgUnits.delete'
  | 'positions.read'
  | 'positions.create'
  | 'positions.update'
  | 'positions.delete'
  | 'employees.read'
  | 'employees.create'
  | 'employees.update'
  | 'employees.delete'
  | 'employees.assignManager'
  | 'parties.read'
  | 'parties.create'
  | 'parties.update'
  | 'parties.delete'
  | 'contacts.read'
  | 'contacts.create'
  | 'contacts.update'
  | 'contacts.delete'
  | 'audit.read';

export interface SessionUser {
  sub?: string;
  email: string;
  permissions: PermissionKey[];
  roleIds: string[];
}

export interface BaseEntity {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RelatedRecord extends BaseEntity {
  code?: string;
  name?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
}

export interface Company extends BaseEntity {
  name: string;
  legalName?: string;
  code?: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  timezone: string;
  currency: string;
  settings?: Record<string, unknown>;
}

export interface Role extends BaseEntity {
  key: string;
  name: string;
  description?: string;
  permissions: PermissionKey[];
  isSystem: boolean;
}

export interface Branch extends BaseEntity {
  code: string;
  name: string;
  type?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
}

export interface OrgUnit extends BaseEntity {
  code: string;
  name: string;
  parentId?: string | RelatedRecord | null;
  branchId?: string | RelatedRecord | null;
  managerEmployeeId?: string | RelatedRecord | null;
  status: string;
}

export interface Position extends BaseEntity {
  code: string;
  name: string;
  level?: string;
  description?: string;
  status: string;
  defaultRoleId?: string | RelatedRecord | null;
  defaultRoleIds?: Array<string | RelatedRecord>;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation?: string;
}

export interface Employee extends BaseEntity {
  employeeCode: string;
  fullName: string;
  normalizedFullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  nationalId?: string;
  address?: string;
  emergencyContacts: EmergencyContact[];
  accountId?: string | RelatedRecord | null;
  branchId?: string | RelatedRecord | null;
  orgUnitId?: string | RelatedRecord | null;
  positionId?: string | RelatedRecord | null;
  managerEmployeeId?: string | RelatedRecord | null;
  employmentType?: string;
  workStatus: string;
  hireDate?: string | null;
  leaveDate?: string | null;
  tags: string[];
  customFields?: Record<string, unknown>;
  notes?: string;
}

export interface ExternalParty extends BaseEntity {
  code: string;
  partyType: 'person' | 'company';
  relationshipTypes: string[];
  displayName: string;
  normalizedDisplayName?: string;
  legalName?: string;
  taxCode?: string;
  website?: string;
  phones: string[];
  emails: string[];
  addresses: string[];
  ownerEmployeeId?: string | RelatedRecord | null;
  assignedEmployeeIds: Array<string | RelatedRecord>;
  source?: string;
  lifecycleStatus: string;
  tags: string[];
  customFields?: Record<string, unknown>;
  notes?: string;
}

export interface ContactPerson extends BaseEntity {
  partyId: string | RelatedRecord;
  fullName: string;
  title?: string;
  department?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface AuditLog extends BaseEntity {
  action: string;
  module: string;
  entityName?: string;
  entityId?: string;
  performedByAccountId?: string;
  metadata: Record<string, unknown>;
}

export interface ApiErrorPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}
