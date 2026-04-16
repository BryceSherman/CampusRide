// Jest setup file
require('dotenv').config({ path: '.env.test' });

// Suppress console output during tests
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}
