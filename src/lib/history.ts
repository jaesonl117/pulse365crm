import { LeadHistory } from '../types/lead';
import { useAuthStore } from '../stores/authStore';

export const createHistoryEntry = (
  action: LeadHistory['action'],
  field?: string,
  oldValue?: string,
  newValue?: string
): LeadHistory => {
  const user = useAuthStore.getState().user;
  
  return {
    id: `hist_${Date.now()}`,
    action,
    field,
    oldValue,
    newValue,
    timestamp: new Date().toISOString(),
    performedBy: {
      id: user?.id || 'system',
      name: user ? `${user.firstName} ${user.lastName}` : 'System',
    },
  };
};