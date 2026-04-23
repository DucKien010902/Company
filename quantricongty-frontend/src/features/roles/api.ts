import { makeCrudApi } from '@/lib/api-client';
import { Role } from '@/types';

export interface RolePayload {
  key: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem?: boolean;
}

export const rolesApi = makeCrudApi<Role, RolePayload, Partial<RolePayload>>('roles');
