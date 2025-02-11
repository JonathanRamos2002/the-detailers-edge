import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Booking from './Booking'

// Mock the Lucide icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-testid="chevron-left" />,
  ChevronRight: () => <div data-testid="chevron-right" />
}))

describe('Booking Component', () => {
  beforeEach(() => {
    render(<Booking />)
  })

  it('renders service titles', () => {
    expect(screen.getByText('Interior Detailing')).toBeInTheDocument()
    expect(screen.getByText('Exterior Detailing')).toBeInTheDocument()
    expect(screen.getByText('Full Service Detail')).toBeInTheDocument()
  })

  it('renders service descriptions', () => {
    expect(screen.getByText(/Complete interior cleaning/)).toBeInTheDocument()
    expect(screen.getByText(/Professional wash, wax/)).toBeInTheDocument()
    expect(screen.getByText(/Comprehensive interior and exterior/)).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    const prevButton = screen.getByTestId('chevron-left')
    const nextButton = screen.getByTestId('chevron-right')
    
    expect(prevButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('carousel navigation works correctly', () => {
    const nextButton = screen.getByTestId('chevron-right').closest('button')
    const firstSlide = screen.getByText('Interior Detailing').closest('div').parentElement
    
    // Initial state
    expect(firstSlide).toHaveStyle('transform: translateX(0%)')
    
    // After clicking next
    fireEvent.click(nextButton)
    expect(firstSlide).toHaveStyle('transform: translateX(-100%)')
  })


  it('carousel wraps around correctly', () => {
    const nextButton = screen.getByTestId('chevron-right').closest('button')
    const prevButton = screen.getByTestId('chevron-left').closest('button')
    const firstSlide = screen.getByText('Interior Detailing').closest('div').parentElement
    
    // Click next 3 times to cycle through all slides
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    
    // Should be back at first slide
    expect(firstSlide).toHaveStyle('transform: translateX(0%)')
    
    // Click previous to go to last slide
    fireEvent.click(prevButton)
    expect(firstSlide).toHaveStyle('transform: translateX(-200%)')
  })

  it('renders service prices', () => {
    const prices = screen.getAllByText(/Starting at \$/i)
    expect(prices).toHaveLength(3)
  })
})