import { Handler } from '@netlify/functions';
import { db } from '../utils/db-client';
import { corsHeaders } from '../utils/headers';
import { success, error } from '../utils/response';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    console.log('Testing database connection...');
    const result = await db.execute({
      sql: 'SELECT 1 as test',
      args: []
    });
    
    return success({
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Database test error:', err);
    return error(
      'Failed to connect to database',
      500,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};