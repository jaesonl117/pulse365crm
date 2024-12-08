import { useAuthStore } from '../stores/authStore';
import { Permission, ROLE_PERMISSIONS } from '../types/auth';

export function usePermissions() {
  const user = useAuthStore(state => state.user);
  
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'TENANT_ADMIN';
  };

  const isManager = (): boolean => {
    return user?.role === 'MANAGER';
  };

  return {
    hasPermission,
    isAdmin,
    isManager,
    role: user?.role
  };
}