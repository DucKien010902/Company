import { makeCrudApi } from '@/lib/api-client';
import { Branch, OrgUnit, Position } from '@/types';

export interface BranchPayload {
  code: string;
  name: string;
  type?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

export interface OrgUnitPayload {
  code: string;
  name: string;
  parentId?: string;
  branchId?: string;
  managerEmployeeId?: string;
  status?: string;
}

export interface PositionPayload {
  code: string;
  name: string;
  level?: string;
  description?: string;
  status?: string;
  defaultRoleId?: string;
  defaultRoleIds?: string[];
}

export const branchesApi = makeCrudApi<Branch, BranchPayload, Partial<BranchPayload>>('branches');
export const orgUnitsApi = makeCrudApi<OrgUnit, OrgUnitPayload, Partial<OrgUnitPayload>>('org-units');
export const positionsApi = makeCrudApi<Position, PositionPayload, Partial<PositionPayload>>('positions');
