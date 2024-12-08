// SQL statements for creating tables
export const createTenantTable = `
  CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'GENERAL_USER',
    tenant_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`;

export const createAddressTable = `
  CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    street TEXT NOT NULL,
    street2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    tenant_id TEXT UNIQUE NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`;

export const createSubscriptionTable = `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL,
    seats INTEGER NOT NULL,
    tenant_id TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  )
`;

// Function to initialize all tables
export const initializeTables = async (executeQuery: (sql: string) => Promise<any>) => {
  await executeQuery(createTenantTable);
  await executeQuery(createUserTable);
  await executeQuery(createAddressTable);
  await executeQuery(createSubscriptionTable);
};