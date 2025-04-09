import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Portfolio from './portfolio';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Portfolio Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          imageUrl: 'https://example.com/image1.jpg',
          title: 'Car Detailing 1'
        },
        {
          id: 2,
          imageUrl: 'https://example.com/image2.jpg',
          title: 'Car Detailing 2'
        }
      ]
    });
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    );

    expect(screen.getByText(/Loading portfolio images/i)).toBeInTheDocument();
  });

  it('renders portfolio images after loading', async () => {
    render(
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading portfolio images/i)).not.toBeInTheDocument();
    });

    // Check if images are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('shows error message when fetch fails', async () => {
    // Mock failed API response
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    );

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load portfolio images/i)).toBeInTheDocument();
    });
  });
});