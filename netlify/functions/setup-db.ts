import { Handler } from '@netlify/functions';
import { createClient } from '@libsql/client';

const TURSO_URL = process.env.TURSO_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso database configuration');
}

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const handler: Handler = async (event) => {
  // Simple response headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Just test the database connection first
  try {
    await db.execute({
      sql: 'SELECT 1'
    });

    // If we get here, connection successful
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Database connection successful'
      })
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database connection failed'
      })
    };
  }
};