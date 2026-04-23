import { requestJson } from '@/lib/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BootstrapPayload {
  company: {
    name: string;
    legalName?: string;
    code?: string;
    taxCode?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  owner: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
  };
}

export const authApi = {
  login(payload: LoginPayload) {
    return requestJson<{ success: boolean; permissions: string[] }>('/api/session/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  bootstrap(payload: BootstrapPayload) {
    return requestJson<{ success: boolean }>('/api/setup/bootstrap', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
