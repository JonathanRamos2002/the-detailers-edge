// Mock environment variables
process.env.PORT = '5001';

const request = require('supertest');
const app = require('../index');
const admin = require('firebase-admin');

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User'
    })
  }),
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: false,
      data: jest.fn().mockReturnValue(null)
    }),
    set: jest.fn().mockResolvedValue(),
    update: jest.fn().mockResolvedValue()
  })
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return success message', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Login successful'
      });
    });
  });

  describe('POST /api/auth/profile', () => {
    it('should create a new user profile', async () => {
      const mockUserData = {
        displayName: 'Test User',
        phoneNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(mockUserData)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User profile created successfully',
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          phoneNumber: '1234567890'
        }
      });

      expect(admin.firestore().collection).toHaveBeenCalledWith('User');
      expect(admin.firestore().doc).toHaveBeenCalledWith('test-uid');
      expect(admin.firestore().set).toHaveBeenCalledWith({
        displayName: 'Test User',
        phoneNumber: '1234567890',
        email: 'test@example.com'
      });
    });

    it('should return 409 if profile already exists', async () => {
      admin.firestore().get.mockResolvedValueOnce({
        exists: true
      });

      const mockUserData = {
        displayName: 'Test User',
        phoneNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(mockUserData)
        .expect(409);

      expect(response.body).toEqual({
        error: 'User profile already exists'
      });
    });

    it('should handle database errors', async () => {
      admin.firestore().get.mockRejectedValueOnce(new Error('Database error'));

      const mockUserData = {
        displayName: 'Test User',
        phoneNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(mockUserData)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to create user profile',
        details: 'Database error'
      });
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return existing user profile', async () => {
      admin.firestore().get.mockResolvedValueOnce({
        exists: true,
        data: jest.fn().mockReturnValue({
          displayName: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890'
        })
      });

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual({
        displayName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890'
      });
    });

    it('should create and return profile for new user', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual({
        displayName: 'Test User',
        email: 'test@example.com',
        phoneNumber: ''
      });

      expect(admin.firestore().set).toHaveBeenCalledWith({
        displayName: 'Test User',
        email: 'test@example.com',
        phoneNumber: ''
      });
    });

    it('should handle database errors', async () => {
      admin.firestore().get.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to get user profile'
      });
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile', async () => {
      // Mock an existing profile
      admin.firestore().get.mockResolvedValueOnce({
        exists: true,
        data: jest.fn().mockReturnValue({
          displayName: 'Old Name',
          phoneNumber: '1234567890'
        })
      });

      // Mock the updated profile
      admin.firestore().get.mockResolvedValueOnce({
        exists: true,
        data: jest.fn().mockReturnValue({
          displayName: 'Updated User',
          phoneNumber: '0987654321',
          updatedAt: new Date().toISOString()
        })
      });

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer test-token')
        .send({
          displayName: 'Updated User',
          phoneNumber: '0987654321'
        })
        .expect(200);

      // Verify the response structure
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.user.displayName).toBe('Updated User');
      expect(response.body.user.phoneNumber).toBe('0987654321');
      
      // Verify that updatedAt is a valid ISO date string
      const updatedAt = new Date(response.body.user.updatedAt);
      expect(updatedAt.toString()).not.toBe('Invalid Date');
    });

    it('should return 404 if profile not found', async () => {
      admin.firestore().get.mockResolvedValueOnce({
        exists: false
      });

      const mockUserData = {
        displayName: 'Updated User',
        phoneNumber: '0987654321'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(mockUserData)
        .expect(404);

      expect(response.body).toEqual({
        error: 'User profile not found'
      });
    });

    it('should handle database errors', async () => {
      admin.firestore().get.mockRejectedValueOnce(new Error('Database error'));

      const mockUserData = {
        displayName: 'Updated User',
        phoneNumber: '0987654321'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(mockUserData)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to update user profile',
        details: 'Database error'
      });
    });
  });
}); 