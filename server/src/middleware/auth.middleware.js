// This file initializes Firebase Admin SDK
// allows the backend to:
//  - Verify Firebase authentication tokens
//  - Access Firebase services securely
//  - Manage users and their data

const { admin } = require('../config/firebase-config');

const authenticateToken = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the token from the Bearer string
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully:', {
      uid: decodedToken.uid,
      email: decodedToken.email
    });

    // Attach the user information to the request
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', {
      message: error.message,
      code: error.code
    });
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
}; 