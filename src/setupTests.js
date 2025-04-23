import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    onAuthStateChanged: vi.fn((callback) => {
      callback(null); // Simulate no user logged in
      return vi.fn(); // Return unsubscribe function
    }),
  })),
}));

// Mock Firebase analytics
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn(),
}));

// Make React available globally
global.React = React; 