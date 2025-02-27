import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Signup from './Signup';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth'); // Get actual module

  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
    })),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({
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

// Mock Firestore
vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(), // Mock getFirestore properly
  };
});

// Mock Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('Signup Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  });

  it('renders Signup form correctly', () => {
    expect(screen.getByText('Start Your Detailing Journey')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
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
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
  });

  it('handles signup errors correctly', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(new Error('Signup failed'));

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles Google signup correctly', async () => {
    signInWithPopup.mockResolvedValueOnce({
      user: { displayName: 'John Doe', email: 'test@example.com', uid: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });
});