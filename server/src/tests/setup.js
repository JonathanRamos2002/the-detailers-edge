// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock Firebase config
jest.mock('../config/firebase-config', () => {
  const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [],
      forEach: function(callback) {
        this.docs.forEach(doc => callback(doc));
      }
    }),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    add: jest.fn(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    startAfter: jest.fn().mockReturnThis(),
    batch: jest.fn().mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      commit: jest.fn().mockResolvedValue()
    })
  };

  return {
    db: mockFirestore,
    admin: {
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn()
      },
      firestore: () => mockFirestore,
      auth: () => ({
        verifyIdToken: jest.fn().mockImplementation((token) => {
          if (token === 'valid-token') {
            return Promise.resolve({
              uid: 'test-uid',
              email: 'test@example.com',
              displayName: 'Test User'
            });
          }
          return Promise.reject(new Error('Invalid token'));
        })
      }),
      FieldValue: {
        serverTimestamp: jest.fn().mockReturnValue(new Date().toISOString())
      }
    }
  };
});

// Create Express app for testing
const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Import actual routes
app.use('/api/contact', require('../routes/contact.routes'));
app.use('/api/testimonials', require('../routes/testimonials.routes'));
app.use('/api/auth', require('../routes/auth.routes'));

// Export the app for testing
module.exports = app;

// Increase timeout for tests
jest.setTimeout(10000); 