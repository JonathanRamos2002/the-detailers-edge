import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Portfolio from './portfolio';

describe('Portfolio Page', () => {
  it('renders the Portfolio page correctly', () => {
    render(
      <BrowserRouter>
        <Portfolio />
      </BrowserRouter>
    );

    expect(screen.getByText('This is the portfolio page!')).toBeInTheDocument();
  });
});