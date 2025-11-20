import { DatabaseState, Table } from './types';

const USERS_TABLE: Table = {
  id: 't1',
  name: 'users',
  description: 'Registered system users and their metadata',
  columns: [
    { name: 'id', type: 'number', isPrimaryKey: true },
    { name: 'full_name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'created_at', type: 'date' },
  ],
  rows: [
    { id: 1, full_name: 'Alice Freeman', email: 'alice@example.com', role: 'admin', status: 'active', created_at: '2023-10-15' },
    { id: 2, full_name: 'Bob Smith', email: 'bob.smith@corp.net', role: 'editor', status: 'active', created_at: '2023-10-16' },
    { id: 3, full_name: 'Charlie Davis', email: 'charlie.d@startup.io', role: 'viewer', status: 'inactive', created_at: '2023-11-01' },
    { id: 4, full_name: 'Diana Prince', email: 'diana@themyscira.com', role: 'admin', status: 'active', created_at: '2023-11-05' },
    { id: 5, full_name: 'Evan Wright', email: 'evan.w@techie.com', role: 'editor', status: 'suspended', created_at: '2023-11-12' },
    { id: 6, full_name: 'Fiona Gallagher', email: 'fiona@chicago.net', role: 'viewer', status: 'active', created_at: '2023-11-20' },
    { id: 7, full_name: 'George Martin', email: 'grrm@books.org', role: 'viewer', status: 'active', created_at: '2023-12-01' },
    { id: 8, full_name: 'Hannah Abbott', email: 'hannah@hogwarts.edu', role: 'editor', status: 'active', created_at: '2023-12-05' },
  ]
};

const ORDERS_TABLE: Table = {
  id: 't2',
  name: 'orders',
  description: 'Customer orders and transaction details',
  columns: [
    { name: 'id', type: 'number', isPrimaryKey: true },
    { name: 'user_id', type: 'number' },
    { name: 'amount', type: 'number' },
    { name: 'currency', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'order_date', type: 'date' },
  ],
  rows: [
    { id: 101, user_id: 1, amount: 150.00, currency: 'USD', status: 'completed', order_date: '2023-10-20' },
    { id: 102, user_id: 2, amount: 49.99, currency: 'USD', status: 'pending', order_date: '2023-10-22' },
    { id: 103, user_id: 1, amount: 299.50, currency: 'USD', status: 'completed', order_date: '2023-11-01' },
    { id: 104, user_id: 4, amount: 12.00, currency: 'EUR', status: 'cancelled', order_date: '2023-11-08' },
    { id: 105, user_id: 6, amount: 85.25, currency: 'USD', status: 'completed', order_date: '2023-11-25' },
    { id: 106, user_id: 2, amount: 1200.00, currency: 'USD', status: 'processing', order_date: '2023-12-02' },
  ]
};

const PRODUCTS_TABLE: Table = {
  id: 't3',
  name: 'products',
  description: 'Inventory items and pricing',
  columns: [
    { name: 'id', type: 'number', isPrimaryKey: true },
    { name: 'sku', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'stock', type: 'number' },
    { name: 'price', type: 'number' },
  ],
  rows: [
    { id: 501, sku: 'TECH-001', name: 'Wireless Keyboard', stock: 45, price: 99.99 },
    { id: 502, sku: 'TECH-002', name: 'Ergo Mouse', stock: 120, price: 59.99 },
    { id: 503, sku: 'MON-001', name: '4K Monitor 27"', stock: 12, price: 499.99 },
    { id: 504, sku: 'ACC-009', name: 'USB-C Cable', stock: 500, price: 12.50 },
    { id: 505, sku: 'AUD-101', name: 'Noise Cancelling Headphones', stock: 30, price: 299.00 },
  ]
};

export const INITIAL_DB_STATE: DatabaseState = {
  name: 'Production_Replica',
  tables: [USERS_TABLE, ORDERS_TABLE, PRODUCTS_TABLE]
};
