import { User } from './auth';

export interface LeadStatus {
  id: string;
  name: string;
  color: string;
  order: number;
  isDefault: boolean;
}

export const DEFAULT_STATUSES: LeadStatus[] = [
  { id: 'status_1', name: 'New', color: '#3B82F6', order: 1, isDefault: true },
  { id: 'status_2', name: 'Contacted', color: '#EAB308', order: 2, isDefault: false },
  { id: 'status_3', name: 'Qualified', color: '#A855F7', order: 3, isDefault: false },
  { id: 'status_4', name: 'Proposal', color: '#6366F1', order: 4, isDefault: false },
  { id: 'status_5', name: 'Negotiation', color: '#F97316', order: 5, isDefault: false },
  { id: 'status_6', name: 'Sold', color: '#22C55E', order: 6, isDefault: false },
  { id: 'status_7', name: 'Lost', color: '#EF4444', order: 7, isDefault: false },
  { id: 'status_8', name: 'Do Not Call', color: '#6B7280', order: 8, isDefault: false },
];

export interface LeadAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface LeadHistory {
  id: string;
  action: 'created' | 'updated' | 'note_added' | 'status_changed';
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  performedBy: {
    id: string;
    name: string;
  };
}

export interface Lead {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: LeadAddress;
  status: LeadStatus;
  notes: Note[];
  history: LeadHistory[];
  createdAt: string;
  updatedAt: string;
}