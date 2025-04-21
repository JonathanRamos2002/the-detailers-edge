// Mock Firebase config before requiring the middleware
const mockVerifyIdToken = jest.fn();
jest.mock('../../config/firebase-config', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: mockVerifyIdToken
    })
  }
}));

const { authenticateToken } = require('../../middleware/auth.middleware');

describe('authenticateToken', () => {
  const mockReq = {
    headers: {},
    user: null
  };
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.headers = {};
    mockReq.user = null;
  });

  test('no token returns 401', async () => {
    await authenticateToken(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  test('invalid token format returns 401', async () => {
    mockReq.headers.authorization = 'BadToken';
    await authenticateToken(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token format' });
  });

  test('valid token sets user and calls next', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    mockReq.headers.authorization = 'Bearer validtoken';
    mockVerifyIdToken.mockResolvedValueOnce(mockUser);

    await authenticateToken(mockReq, mockRes, mockNext);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  test('firebase error returns 403', async () => {
    mockReq.headers.authorization = 'Bearer invalidtoken';
    mockVerifyIdToken.mockRejectedValueOnce(new Error('Invalid token'));

    await authenticateToken(mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });
}); 