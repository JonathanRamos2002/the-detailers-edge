const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with service account credentials
const serviceAccount = require('../../../firebase-service-account.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

module.exports = {
  admin,
  db
}; 