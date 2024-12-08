import { loadMockDb } from './mockDbServer.ts';

async function viewUsers() {
  try {
    const mockDb = loadMockDb();

    if (!mockDb.users || mockDb.users.length === 0) {
      console.log('\nNo users found in the system.');
      return;
    }

    console.log('\nRegistered Users:');
    console.log('================\n');

    mockDb.users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.firstName} ${user.lastName}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Tenant ID: ${user.tenantId}`);
      console.log(`  Status: ${user.status}`);
      console.log(`  Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log('----------------\n');
    });
  } catch (error) {
    console.error('Error viewing users:', error);
  }
}

viewUsers().catch(console.error);