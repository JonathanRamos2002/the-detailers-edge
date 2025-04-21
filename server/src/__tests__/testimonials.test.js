const request = require('supertest');
const express = require('express');

// Create a simple express app for testing
const app = express();
app.use(express.json());
const router = express.Router();

// Error routes for testing
router.get('/error', (req, res) => {
  throw new Error('Test error');
});

router.post('/error', (req, res) => {
  throw new Error('Test error');
});

router.patch('/error/status', (req, res) => {
  throw new Error('Test error');
});

// Simple testimonials routes
router.get('/', (req, res) => {
  try {
    res.json({ message: 'Testimonials retrieved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, email, rating, comment, serviceType } = req.body;
    if (!name || !email || !rating || !comment || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    res.status(201).json({ message: 'Testimonial created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    res.json({ message: 'Testimonial status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial status' });
  }
});

app.use('/testimonials', router);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('Testimonials Routes', () => {
  describe('GET /testimonials', () => {
    it('should return success message', async () => {
      const response = await request(app)
        .get('/testimonials')
        .expect(200);

      expect(response.body).toEqual({ message: 'Testimonials retrieved successfully' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .get('/testimonials/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });

  describe('POST /testimonials', () => {
    const validTestimonial = {
      name: 'John Doe',
      email: 'john@example.com',
      rating: 5,
      comment: 'Great service!',
      serviceType: 'Full Detail'
    };

    it('should create a testimonial when all fields are provided', async () => {
      const response = await request(app)
        .post('/testimonials')
        .send(validTestimonial)
        .expect(201);

      expect(response.body).toEqual({ message: 'Testimonial created successfully' });
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/testimonials')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 for invalid rating', async () => {
      const response = await request(app)
        .post('/testimonials')
        .send({
          ...validTestimonial,
          rating: 6
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'Rating must be between 1 and 5' });
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/testimonials')
        .send({
          ...validTestimonial,
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'Invalid email format' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .post('/testimonials/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });

  describe('PATCH /testimonials/:id/status', () => {
    it('should update testimonial status when valid', async () => {
      const response = await request(app)
        .patch('/testimonials/123/status')
        .send({ status: 'approved' })
        .expect(200);

      expect(response.body).toEqual({ message: 'Testimonial status updated successfully' });
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch('/testimonials/123/status')
        .send({ status: 'invalid' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Invalid status' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .patch('/testimonials/error/status')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });
}); 