// This file initializes Firebase Admin SDK
// allows the backend to:
//  - Verify Firebase authentication tokens
//  - Access Firebase services securely
//  - Manage users and their data

const admin = require('../config/firebase-config');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken }; 