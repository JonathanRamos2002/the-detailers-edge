const express = require('express');
const cors = require('cors');
require('dotenv').config();
const admin = require('./config/firebase-config');

const app = express();

// Cors allows frontend to call the API
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to The Detailers Edge API',
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      contact: '/api/contact',
      testimonials: '/api/testimonials',
      portfolio: '/api/portfolio',
      services: '/api/services'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'The Detailers Edge API Endpoints',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: '/api/auth/login',
        profile: {
          get: '/api/auth/profile',
          put: '/api/auth/profile'
        }
      },
      contact: {
        post: '/api/contact'
      },
      testimonials: {
        get: '/api/testimonials',
        post: '/api/testimonials',
        updateStatus: '/api/testimonials/:id/status',
        delete: '/api/testimonials/:id'
      },
      portfolio: {
        get: '/api/portfolio',
        upload: '/api/portfolio/upload',
        delete: '/api/portfolio/:id'
      },
      services: {
        get: '/api/services',
        post: '/api/services',
        put: '/api/services/:id',
        delete: '/api/services/:id'
      }
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/portfolio', require('./routes/portfolio.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/testimonials', require('./routes/testimonials.routes'));
app.use('/api/services', require('./routes/services.routes'));

// Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});