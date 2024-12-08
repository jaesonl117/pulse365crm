import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockDb } from '../lib/mockDb';
import type { RegisterTenantData, LoginCredentials } from '../types/auth';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

export async function registerTenant(data: RegisterTenantData) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const tenant = mockDb.createTenant({
    name: data.companyName,
    industry: data.businessDetails.industry,
    taxId: data.businessDetails.taxId,
  });

  mockDb.createAddress({
    ...data.businessDetails.address,
    tenantId: tenant.id,
  });

  mockDb.createSubscription({
    ...data.subscription,
    tenantId: tenant.id,
  });

  const user = mockDb.createUser({
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'TENANT_ADMIN',
    tenantId: tenant.id,
  });

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: tenant.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { user, token };
}

export async function login(credentials: LoginCredentials) {
  const user = mockDb.findUserByEmail(credentials.email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(credentials.password, user.password);
  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { user, token };
}