import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Testimonials from './testimonials';
import axios from 'axios';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('Testimonials Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  it('renders the page title', () => {
    render(
      <BrowserRouter>
        <Testimonials />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Client Testimonials/i)).toBeInTheDocument();
  });
}); 