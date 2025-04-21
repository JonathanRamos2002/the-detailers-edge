const isAdmin = require('../../middleware/admin.middleware');

describe('Admin Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            user: {
                email: 'test@example.com'
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    test('should allow access for admin email', () => {
        mockReq.user.email = 'detailersedge135@gmail.com';
        
        isAdmin(mockReq, mockRes, mockNext);
        
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('should deny access for non-admin email', () => {
        mockReq.user.email = 'user@example.com';
        
        isAdmin(mockReq, mockRes, mockNext);
        
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Access denied. Admin privileges required.'
        });
    });

    test('should handle missing user object', () => {
        mockReq.user = null;
        
        isAdmin(mockReq, mockRes, mockNext);
        
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error checking admin status'
        });
    });
}); 