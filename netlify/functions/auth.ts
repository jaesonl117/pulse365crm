import { Handler } from '@netlify/functions';
import { db } from './utils/db-client';
import { corsHeaders } from './utils/headers';
import { success, error } from './utils/response';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    await db.execute({ 
      sql: 'SELECT 1', 
      args: [] 
    });
    return success({ message: 'Auth service is healthy' });
  } catch (err) {
    console.error('Auth service error:', err);
    return error(
      'Auth service error',
      500,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};