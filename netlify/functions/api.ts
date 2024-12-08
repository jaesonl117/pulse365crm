import { Handler } from '@netlify/functions';
import { createClient } from '@libsql/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TURSO_URL = process.env.TURSO_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso database configuration');
}

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const path = event.path.replace(/^\/\.netlify\/functions\/api\//, '');
  console.log('API path:', path, 'Method:', event.httpMethod);

  try {
    // Public routes
    if (path === 'auth/register-tenant' && event.httpMethod === 'POST') {
      const { companyName, email, password, firstName, lastName } = JSON.parse(event.body || '{}');
      
      // Validate required fields
      if (!email || !password || !companyName || !firstName || !lastName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields' })
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create tenant
      const tenantId = `tenant_${Date.now()}`;
      await db.execute({
        sql: 'INSERT INTO tenants (id, name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        args: [
          tenantId,
          companyName,
          'active',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });

      // Create user
      const userId = `user_${Date.now()}`;
      await db.execute({
        sql: `INSERT INTO users (
          id, email, password, first_name, last_name, role, tenant_id, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          userId,
          email,
          hashedPassword,
          firstName,
          lastName,
          'TENANT_ADMIN',
          tenantId,
          'active',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });

      // Generate JWT
      const token = jwt.sign(
        {
          id: userId,
          email,
          firstName,
          lastName,
          role: 'TENANT_ADMIN',
          tenantId
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          user: {
            id: userId,
            email,
            firstName,
            lastName,
            role: 'TENANT_ADMIN',
            tenantId
          },
          token
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not found' })
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};