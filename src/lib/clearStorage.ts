import { mockDb } from './mockDb';

// Clear all storage data
export const clearAllStorage = () => {
  try {
    // Clear localStorage in browser context
    if (typeof window !== 'undefined') {
      localStorage.clear();
      
      // Clear specific storage keys
      const keysToRemove = [
        'mockDb',
        'auth-store',
        'lead-store',
        'theme-storage',
        'dashboard-storage',
        'custom-fields-storage',
        'auth-store-v3',
        'lead-store-v4'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    }

    // Reset mockDb state
    mockDb.clearAllData();

    console.log('Storage cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};