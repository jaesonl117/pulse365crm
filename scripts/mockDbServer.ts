import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '../.mockdb');

interface DbState {
  users: any[];
  tenants: any[];
  addresses: any[];
  subscriptions: any[];
  leads: any[];
  version: number;
  lastUpdated: string;
}

export function loadMockDb(): DbState {
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mockDb:', error);
    return getInitialState();
  }
}

export function saveMockDb(state: DbState) {
  try {
    writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Error writing mockDb:', error);
  }
}

function getInitialState(): DbState {
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