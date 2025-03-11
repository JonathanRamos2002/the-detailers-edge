// This file contains the routes for the authentication endpoints
// - Checks for the presence of an authentication token
// - Verifies the token with Firebase
// - Attaches user information to the request
// - Used to protect routes that require authentication

const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config');
const { authenticateToken } = require('../middleware/auth.middleware');

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verify the user's credentials with Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    // Return user data
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ 
      message: 'Invalid email or password',
      error: error.message 
    });
  }
});

// Get user profile (GET REQUEST) - Authenticated/Protected Route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    res.json(user);
    //console.log('User profile fetched successfully');
    //console.log(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile (PUT REQUEST) - Authenticated/Protected Route
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, phoneNumber } = req.body;
    const user = await admin.auth().updateUser(req.user.uid, {
      displayName,
      phoneNumber
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

module.exports = router; 