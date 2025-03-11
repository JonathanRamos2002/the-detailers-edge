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
      auth: '/api/auth'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'The Detailers Edge API Endpoints',
    version: '1.0.0',
    endpoints: {
      auth: {
        profile: {
          get: '/api/auth/profile',
          put: '/api/auth/profile'
        }
      }
    }
  });
});

// API Route for auth
app.use('/api/auth', require('./routes/auth.routes'));

// Error handling 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 