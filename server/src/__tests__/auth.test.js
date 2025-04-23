const request = require('supertest');
const app = require('../tests/setup');
const { admin } = require('../config/firebase-config');

describe('Auth API', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  const mockToken = 'valid-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Authentication successful',
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        }
      });
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Authentication failed'
      });
    });

    it('should handle missing token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'No token provided'
      });
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        profile: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        }
      });
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Authentication failed'
      });
    });
  });

  describe('PUT /api/auth/profile', () => {
    const updatedProfile = {
      displayName: 'Updated Name',
      phoneNumber: '1234567890'
    };

    it('should update user profile', async () => {
      admin.auth().updateUser = jest.fn().mockResolvedValueOnce({
        ...mockUser,
        ...updatedProfile
      });

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(updatedProfile)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Profile updated successfully',
        profile: {
          ...mockUser,
          ...updatedProfile
        }
      });
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          displayName: '' // Invalid empty name
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Invalid profile data'
      });
    });

    it('should handle unauthorized profile update', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send(updatedProfile)
        .expect(401);

      expect(response.body).toMatchObject({
        error: 'Authentication failed'
      });
    });
  });
});