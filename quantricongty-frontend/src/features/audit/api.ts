import { requestJson } from '@/lib/api-client';
import { AuditLog } from '@/types';

export const auditApi = {
  list(limit = 50) {
    return requestJson<AuditLog[]>(`/api/proxy/audit-logs?limit=${limit}`);
  },
};
