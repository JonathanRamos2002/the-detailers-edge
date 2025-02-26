import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './login';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');

  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({
      user: { uid: '12345', email: 'test@example.com' },
    }),
    signInWithPopup: vi.fn().mockResolvedValue({
      user: {
        displayName: 'John Doe',
        email: 'test@example.com',
        uid: '12345',
      },
    }),
  };
});

// Mock Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Login Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  it('renders Login form correctly', () => {
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', { name: '' }); // No text, only an icon

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles form input changes', () => {
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('handles login errors correctly', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(new Error('Login failed'));

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles Google login correctly', async () => {
    signInWithPopup.mockResolvedValueOnce({
      user: { displayName: 'John Doe', email: 'test@example.com', uid: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });
});