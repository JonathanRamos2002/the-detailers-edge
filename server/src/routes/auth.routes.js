// This file contains the routes for the authentication endpoints
// - Checks for the presence of an authentication token
// - Verifies the token with Firebase
// - Attaches user information to the request
// - Used to protect routes that require authentication

const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase-config');
const { authenticateToken } = require('../middleware/auth.middleware');

// Login user
router.post('/login', async (req, res) => {
  try {
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Create user profile (signup)
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, phoneNumber } = req.body;
    const uid = req.user.uid;

    console.log('Creating profile for user:', {
      uid,
      displayName,
      phoneNumber,
      email: req.user.email
    });

    // Create user profile in Firestore
    const userRef = db.collection('User').doc(uid);
    
    // Check if user already exists
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      console.log('User profile already exists');
      return res.status(409).json({ error: 'User profile already exists' });
    }

    // Create new profile
    await userRef.set({
      displayName,
      phoneNumber,
      email: req.user.email
    });

    console.log('User profile created successfully');

    res.status(201).json({
      message: 'User profile created successfully',
      user: {
        uid,
        email: req.user.email,
        displayName,
        phoneNumber
      }
    });
  } catch (error) {
    console.error('Create profile error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to create user profile',
      details: error.message 
    });
  }
});

// Get user profile (GET REQUEST) - Authenticated/Protected Route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userRef = db.collection('User').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create profile if it doesn't exist (for Google sign-in users)
      await userRef.set({
        displayName: req.user.displayName || '',
        email: req.user.email,
        phoneNumber: req.user.phoneNumber || ''
      });

      return res.json({
        displayName: req.user.displayName || '',
        email: req.user.email,
        phoneNumber: req.user.phoneNumber || ''
      });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile (PUT REQUEST) - Authenticated/Protected Route
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, phoneNumber } = req.body;
    const uid = req.user.uid;

    console.log('Updating profile for user:', {
      uid,
      displayName,
      phoneNumber
    });

    const userRef = db.collection('User').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    await userRef.update({
      displayName,
      phoneNumber,
      updatedAt: new Date().toISOString()
    });

    // Get the updated profile
    const updatedDoc = await userRef.get();
    const updatedProfile = updatedDoc.data();

    console.log('Profile updated successfully:', updatedProfile);

    res.json({
      message: 'Profile updated successfully',
      user: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to update user profile',
      details: error.message 
    });
  }
});

module.exports = router; 