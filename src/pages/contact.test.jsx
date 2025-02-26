import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Contact from './contact';

describe('Contact Page', () => {
  it('renders the Contact page correctly', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );

    expect(screen.getByText('Contact Us Now!')).toBeInTheDocument();
  });
});