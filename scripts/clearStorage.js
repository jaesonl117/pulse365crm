import { saveMockDb } from './mockDbServer.ts';

function getInitialState() {
  return {
    users: [],
    tenants: [],
    addresses: [],
    subscriptions: [],
    leads: [],
    version: 2,
    lastUpdated: new Date().toISOString()
  };
}

// Function to clear all storage
async function clearStorage() {
  try {
    // Save clean state
    saveMockDb(getInitialState());
    console.log('Storage cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

clearStorage().catch(console.error);