import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Contact from './contact';

// Mock fetch
global.fetch = vi.fn();

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });
  });

  it('renders the page title', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    // Find form by its submit button
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    // Find inputs by their labels
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });
});