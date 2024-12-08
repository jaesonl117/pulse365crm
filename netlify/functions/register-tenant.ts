import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { db } from './utils/db-client';
import { generateToken } from './utils/auth';
import { corsHeaders } from './utils/headers';
import { success, error } from './utils/response';

interface RegistrationData {
  email: string;
  password: string;
  companyName: string;
  firstName: string;
  lastName: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const { email, password, companyName, firstName, lastName }: RegistrationData = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!email || !password || !companyName || !firstName || !lastName) {
      return error('Missing required fields', 400);
    }

    // Check if user exists
    const existingUser = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (existingUser.rows.length > 0) {
      return error('Email already registered', 400);
    }

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

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
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

    const user = {
      id: userId,
      email,
      firstName,
      lastName,
      role: 'TENANT_ADMIN',
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const token = generateToken(user);

    return success({
      user,
      token
    }, 201);

  } catch (err) {
    console.error('Registration error:', err);
    return error(
      'Registration failed',
      500,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
};