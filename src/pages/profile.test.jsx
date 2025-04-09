import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Profile from './profile';
import { vi } from 'vitest';

// Mock firebase
vi.mock('../firebase', () => ({
  auth: {
    onAuthStateChanged: (callback) => {
      callback({ uid: '123' });
      return () => {};
    }
  }
}));

// Mock api
vi.mock('../services/api', () => ({
  default: {
    getUserProfile: () => Promise.resolve({})
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => () => {},
  Link: ({ children }) => children
}));

describe('Profile', () => {
  it('renders', () => {
    render(<Profile />);
  });
});
