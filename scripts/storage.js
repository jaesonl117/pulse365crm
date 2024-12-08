// Storage viewer and cleaner script
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), '.mockdb');

function loadMockDb() {
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return getInitialState();
  }
}

function saveMockDb(state) {
  try {
    writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Error saving mockDb:', error);
  }
}

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

function viewStorage() {
  const state = loadMockDb();
  console.log('\nStorage State:');
  console.log('=============\n');
  console.log('Users:', state.users.length);
  state.users.forEach(user => {
    console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
  });
  console.log('\nTenants:', state.tenants.length);
  console.log('\nVersion:', state.version);
  console.log('Last Updated:', state.lastUpdated);
}

function clearStorage() {
  saveMockDb(getInitialState());
  console.log('\nStorage cleared successfully');
}

// Handle command line arguments
const command = process.argv[2];
if (command === 'view') {
  viewStorage();
} else if (command === 'clear') {
  clearStorage();
} else {
  console.log('\nUsage: node storage.js [view|clear]');
}