import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Services from './services';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Services Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response with complete mock services data
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Basic Wash',
          description: 'Basic exterior wash',
          price: 25,
          features: [
            'Exterior hand wash',
            'Wheel cleaning',
            'Tire dressing',
            'Window cleaning'
          ],
          imageUrl: 'https://example.com/basic-wash.jpg'
        }
      ]
    });
  });

  it('shows error message when fetch fails', async () => {
    // Mock failed API response
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      render(
        <BrowserRouter>
          <Services />
        </BrowserRouter>
      );
    });

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load services/i)).toBeInTheDocument();
    });
  });
});
