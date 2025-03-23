const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-config');
const { FieldValue } = require('firebase-admin/firestore');

// Contact form endpoint
router.post('/', async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: Object.entries({ name, email, subject, message })
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Store contact form submission in Firebase
    const contactRef = db.collection('contact_submissions');
    const submission = await contactRef.add({
      name,
      email,
      subject,
      message,
      timestamp: FieldValue.serverTimestamp(),
      status: 'unread'
    });

    console.log('Contact form submission stored with ID:', submission.id);

    res.status(200).json({ 
      message: 'Message sent successfully',
      submissionId: submission.id
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      message: 'Failed to process message',
      error: error.message 
    });
  }
});

module.exports = router; 