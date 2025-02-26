import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './profile';
import { auth, db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

// Mock Firebase Auth
vi.mock('../firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  },
  db: {},
}));

// Mock Firestore Functions
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getDoc: vi.fn(),
    doc: vi.fn(),
  };
});

// Mock Navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Profile Component', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays user data when fetched', async () => {
    const mockUserSnapshot = { exists: () => true, data: () => mockUser };

    auth.onAuthStateChanged.mockImplementationOnce((callback) => {
      callback({ uid: '12345' });
    });

    getDoc.mockResolvedValueOnce(mockUserSnapshot);
    doc.mockReturnValueOnce({});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('handles user logout', async () => {
    auth.signOut.mockResolvedValueOnce();

    vi.mocked(auth.onAuthStateChanged).mockImplementationOnce((callback) => {
      callback({ uid: '12345' });
    });

    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUser,
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Log Out'));

    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalled();
    });
  });
});
