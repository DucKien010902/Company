import { makeCrudApi } from '@/lib/api-client';
import { Employee } from '@/types';

export interface EmployeePayload {
  employeeCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  nationalId?: string;
  address?: string;
  branchId?: string;
  orgUnitId?: string;
  positionId?: string;
  managerEmployeeId?: string;
  employmentType?: string;
  workStatus?: string;
  hireDate?: string;
  leaveDate?: string;
  tags?: string[];
  emergencyContacts?: Array<{ name: string; phone: string; relation?: string }>;
  customFields?: Record<string, unknown>;
  notes?: string;
}

export const employeesApi = makeCrudApi<Employee, EmployeePayload, Partial<EmployeePayload>>('employees');
