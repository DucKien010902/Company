import { requestJson } from '@/lib/api-client';
import { Company } from '@/types';

export const companyApi = {
  get() {
    return requestJson<Company>('/api/proxy/company/profile');
  },
  update(payload: Partial<Company>) {
    return requestJson<Company>('/api/proxy/company/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
