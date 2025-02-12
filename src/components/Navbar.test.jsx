import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
  });

  test('renders Navbar component', () => {
    // Check if the logo is rendered
    const logo = screen.getByAltText('Detailers Edge');
    expect(logo).toBeInTheDocument();

    // Check if the navigation links are rendered
    const servicesLinks = screen.getAllByText('Services');
    const portfolioLinks = screen.getAllByText('Portfolio');
    const testimonialsLinks = screen.getAllByText('Testimonials');
    const contactLinks = screen.getAllByText('Contact');
    const bookNowLinks = screen.getAllByText('Book Now');
    const signUpLinks = screen.getAllByText('Sign Up');

    expect(servicesLinks.length).toBeGreaterThan(0);
    expect(portfolioLinks.length).toBeGreaterThan(0);
    expect(testimonialsLinks.length).toBeGreaterThan(0);
    expect(contactLinks.length).toBeGreaterThan(0);
    expect(bookNowLinks.length).toBeGreaterThan(0);
    expect(signUpLinks.length).toBeGreaterThan(0);
  });

});