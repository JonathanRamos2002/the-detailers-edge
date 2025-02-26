import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Testimonials from './testimonials';

describe('Testimonials Page', () => {
  it('renders the Testimonials page correctly', () => {
    render(
      <BrowserRouter>
        <Testimonials />
      </BrowserRouter>
    );

    expect(screen.getByText('This is the testimonials page!')).toBeInTheDocument();
  });
});