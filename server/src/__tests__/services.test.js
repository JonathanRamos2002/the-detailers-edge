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

router.put('/error', (req, res) => {
  throw new Error('Test error');
});

router.delete('/error', (req, res) => {
  throw new Error('Test error');
});

// Simple services routes
router.get('/', (req, res) => {
  try {
    res.json({ message: 'Services retrieved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/', (req, res) => {
  try {
    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    res.status(201).json({ message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing service ID' });
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing service ID' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

app.use('/services', router);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe('Services Routes', () => {
  describe('GET /services', () => {
    it('should return success message', async () => {
      const response = await request(app)
        .get('/services')
        .expect(200);

      expect(response.body).toEqual({ message: 'Services retrieved successfully' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .get('/services/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });

  describe('POST /services', () => {
    it('should create a service when all fields are provided', async () => {
      const response = await request(app)
        .post('/services')
        .send({
          name: 'Test Service',
          description: 'Test Description',
          price: 100
        })
        .expect(201);

      expect(response.body).toEqual({ message: 'Service created successfully' });
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/services')
        .send({
          name: 'Test Service'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .post('/services/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });

  describe('PUT /services/:id', () => {
    it('should update a service when ID is provided', async () => {
      const response = await request(app)
        .put('/services/123')
        .expect(200);

      expect(response.body).toEqual({ message: 'Service updated successfully' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .put('/services/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });

  describe('DELETE /services/:id', () => {
    it('should delete a service when ID is provided', async () => {
      const response = await request(app)
        .delete('/services/123')
        .expect(200);

      expect(response.body).toEqual({ message: 'Service deleted successfully' });
    });

    it('should handle errors', async () => {
      const response = await request(app)
        .delete('/services/error')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
    });
  });
}); 