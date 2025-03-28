const express = require('express');
const router = express.Router();
const { 
  createTestimonial, 
  getTestimonials, 
  updateTestimonialStatus,
  deleteTestimonial 
} = require('../services/testimonials');

// Create a new testimonial
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, comment, serviceType } = req.body;

    // Validate required fields
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({
        message: 'Required fields are missing',
        missing: Object.entries({ name, email, rating, comment })
          .filter(([_, value]) => !value)
          .map(([key]) => key)
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const testimonial = await createTestimonial({
      name,
      email,
      rating,
      comment,
      serviceType
    });

    res.status(201).json({
      message: 'Testimonial submitted successfully',
      testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      message: 'Failed to submit testimonial',
      error: error.message
    });
  }
});

// Get all approved testimonials
router.get('/', async (req, res) => {
  try {
    const result = await getTestimonials(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

// Update testimonial status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await updateTestimonialStatus(req.params.id, status);
    res.status(200).json({ message: 'Testimonial status updated successfully' });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(500).json({
      message: 'Failed to update testimonial status',
      error: error.message
    });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', async (req, res) => {
  try {
    await deleteTestimonial(req.params.id);
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      message: 'Failed to delete testimonial',
      error: error.message
    });
  }
});

module.exports = router; 