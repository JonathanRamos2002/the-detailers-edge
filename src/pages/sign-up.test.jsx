import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignUp from './sign-up';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    signup: vi.fn(),
    googleSignIn: vi.fn()
  }
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('lucide-react', () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eye-off-icon" />
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign up with Google')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(phoneInput.value).toBe('123-456-7890');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const toggleButtons = screen.getAllByRole('button');

    // Password should be hidden by default
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    // Click to show password
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('text');

    // Click to show confirm password
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput.type).toBe('text');

    // Click to hide password again
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('password');

    // Click to hide confirm password again
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput.type).toBe('password');
  });

  it('shows error message when form is submitted with empty fields', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Sign Up');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('shows error when password is too short', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('handles successful signup', async () => {
    api.signup.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.signup).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John Doe',
        '123-456-7890'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('handles signup error', async () => {
    const errorMessage = 'Email already in use';
    api.signup.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles Google sign-in', async () => {
    api.googleSignIn.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const googleButton = screen.getByText('Sign up with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(api.googleSignIn).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('handles Google sign-in error', async () => {
    const errorMessage = 'Google sign-in failed';
    api.googleSignIn.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const googleButton = screen.getByText('Sign up with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('navigates to login page when login link is clicked', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const loginLink = screen.getByText('Log In');
    fireEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('disables buttons during loading state', async () => {
    api.signup.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Sign Up');
    const googleButton = screen.getByText('Sign up with Google');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(googleButton).toBeDisabled();
      expect(submitButton.textContent).toBe('Creating Account...');
      expect(googleButton.textContent).toBe('Signing up...');
    });
  });
}); 