import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from './Navbar'

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    onAuthStateChanged: vi.fn((callback) => {
      callback(null); // Simulate no user logged in
      return vi.fn(); // Return unsubscribe function
    }),
  })),
}))

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )

    // Check for navigation links (should appear twice - in main nav and mobile menu)
    expect(screen.getAllByText('Services')).toHaveLength(2)
    expect(screen.getAllByText('Portfolio')).toHaveLength(2)
    expect(screen.getAllByText('Testimonials')).toHaveLength(2)
    expect(screen.getAllByText('Contact')).toHaveLength(2)
  })
})