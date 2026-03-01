/**
 * ============================================================
 * IN-MEMORY DATABASE (Temporary Data Storage)
 * ============================================================
 * This file simulates a database by storing data in memory
 * In production, you would use a real database like MongoDB or PostgreSQL
 * 
 * Note: Data will be lost when the server restarts
 * ============================================================
 */

// Generate unique IDs using UUID
const { v4: uuidv4 } = require('uuid');

// ============================================================
// SAMPLE USERS DATA
// ============================================================
const users = [
  {
    id: uuidv4(),
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '03001234567',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '03009876543',
    createdAt: new Date(),
  },
];

// ============================================================
// SAMPLE PRODUCTS DATA
// ============================================================
const products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop for work',
    price: 120000,
    stock: 10,
    category: 'Electronics',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    price: 80000,
    stock: 25,
    category: 'Electronics',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Headphones',
    description: 'Wireless noise-cancelling headphones',
    price: 8000,
    stock: 50,
    category: 'Accessories',
    createdAt: new Date(),
  },
];

// ============================================================
// SAMPLE ORDERS DATA
// ============================================================
const orders = [
  {
    id: uuidv4(),
    userId: users[0].id,
    items: [
      {
        productId: products[0].id,
        quantity: 1,
        price: products[0].price,
      },
    ],
    totalAmount: products[0].price,
    status: 'Delivered',
    createdAt: new Date(),
  },
];

// ============================================================
// EXPORT DATA STORAGE
// ============================================================
// These objects are exported so route handlers can access them
module.exports = {
  users,
  products,
  orders,
  // Helper function to generate unique IDs
  generateId: uuidv4,
};
