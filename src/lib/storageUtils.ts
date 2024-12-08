// Utility to view all stored data
export const viewStorageData = () => {
  try {
    // Get mockDb data
    const mockDbData = localStorage.getItem('mockDb');
    const parsedMockDb = mockDbData ? JSON.parse(mockDbData) : null;

    // Get auth store data
    const authStoreData = localStorage.getItem('auth-store-v3');
    const parsedAuthStore = authStoreData ? JSON.parse(authStoreData) : null;

    // Get lead store data
    const leadStoreData = localStorage.getItem('lead-store-v4');
    const parsedLeadStore = leadStoreData ? JSON.parse(leadStoreData) : null;

    console.log('\n=== Storage Data ===\n');
    
    if (parsedMockDb?.users?.length > 0) {
      console.log('MockDB Users:');
      parsedMockDb.users.forEach((user: any) => {
        console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
      });
    } else {
      console.log('No users in MockDB');
    }

    if (parsedAuthStore?.state?.user) {
      console.log('\nCurrent Auth User:', parsedAuthStore.state.user.email);
    }

    return {
      mockDb: parsedMockDb,
      authStore: parsedAuthStore,
      leadStore: parsedLeadStore
    };
  } catch (error) {
    console.error('Error viewing storage:', error);
    return null;
  }
};

// Utility to clear all storage
export const clearAllStorageData = () => {
  try {
    // Clear all localStorage
    localStorage.clear();

    // Reset mockDb with clean state
    const cleanState = {
      users: [],
      tenants: [],
      addresses: [],
      subscriptions: [],
      leads: [],
      version: 2,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('mockDb', JSON.stringify(cleanState));
    console.log('All storage data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};