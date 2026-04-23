import { makeCrudApi } from '@/lib/api-client';
import { ContactPerson, ExternalParty } from '@/types';

export interface PartyPayload {
  code: string;
  partyType: 'person' | 'company';
  relationshipTypes: string[];
  displayName: string;
  legalName?: string;
  taxCode?: string;
  website?: string;
  phones?: string[];
  emails?: string[];
  addresses?: string[];
  ownerEmployeeId?: string;
  assignedEmployeeIds?: string[];
  source?: string;
  lifecycleStatus?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
  notes?: string;
}

export interface ContactPayload {
  partyId: string;
  fullName: string;
  title?: string;
  department?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
  notes?: string;
}

export const partiesApi = makeCrudApi<ExternalParty, PartyPayload, Partial<PartyPayload>>('parties');
export const contactsApi = makeCrudApi<ContactPerson, ContactPayload, Partial<ContactPayload>>('contacts');
