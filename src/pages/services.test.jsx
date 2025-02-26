import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Services from './services';

describe('Services Page', () => {
  it('renders the Services page correctly', () => {
    render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );

    expect(screen.getByText('This is the services page!')).toBeInTheDocument();
  });
});
