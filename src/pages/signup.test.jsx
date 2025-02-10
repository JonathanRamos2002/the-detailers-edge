import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import SignUp from './signup';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mock Firebase
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn()
}));

// Mock Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});
// Mock Firebase
vi.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: vi.fn(),
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
   }));
   
   // Mock Firebase Analytics
   vi.mock('firebase/analytics', () => ({
    getAnalytics: vi.fn()
   }));
   
   // Mock Firebase App
   vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
   }));

describe('SignUp Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  });

  test('renders signup form', () => {
    expect(screen.getByText('Admin Login')).toBeDefined();
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: '' });
    
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
  });

  test('handles form submission', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce(undefined);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    await fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  });
});