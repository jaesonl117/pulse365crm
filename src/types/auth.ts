import { User as FirebaseUser } from 'firebase/auth';
import { BusinessIndustry, BusinessDetails } from './business';
import { SubscriptionTier } from './subscription';

export enum UserRole {
  TENANT_ADMIN = 'TENANT_ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  businessDetails: BusinessDetails;
  subscription?: {
    tier: SubscriptionTier;
    seats: number;
  };
}

export const ROLE_PERMISSIONS = {
  [UserRole.TENANT_ADMIN]: {
    name: 'Admin',
    description: 'Full system access including user management and billing',
    permissions: [
      'manage_users',
      'manage_settings',
      'manage_billing',
      'view_all_leads',
      'manage_all_leads',
      'view_reports',
      'manage_campaigns',
      'view_dashboard'
    ]
  },
  [UserRole.MANAGER]: {
    name: 'Manager',
    description: 'Access to all leads and reports, but no administrative control',
    permissions: [
      'view_all_leads',
      'manage_all_leads',
      'view_reports',
      'manage_campaigns',
      'view_dashboard'
    ]
  },
  [UserRole.USER]: {
    name: 'User',
    description: 'Access to assigned leads only',
    permissions: [
      'view_own_leads',
      'manage_own_leads',
      'view_dashboard'
    ]
  }
} as const;

export type Permission = typeof ROLE_PERMISSIONS[UserRole]['permissions'][number];