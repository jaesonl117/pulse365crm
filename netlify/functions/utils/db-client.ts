import { createClient } from '@libsql/client';

if (!process.env.TURSO_URL) {
  throw new Error('TURSO_URL environment variable is not set');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is not set');
}

export const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  timeout: {
    connect: 10000, // 10 seconds
    execute: 30000, // 30 seconds
  }
});

// Add error handling wrapper
export const executeQuery = async (sql: string, args?: any[]) => {
  try {
    const result = await db.execute({ 
      sql, 
      args: args || [] 
    });
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Database operation failed');
  }
};

// Add transaction helper
export const withTransaction = async (operations: () => Promise<any>) => {
  try {
    await db.execute({ sql: 'BEGIN' });
    const result = await operations();
    await db.execute({ sql: 'COMMIT' });
    return result;
  } catch (error) {
    await db.execute({ sql: 'ROLLBACK' });
    throw error;
  }
};