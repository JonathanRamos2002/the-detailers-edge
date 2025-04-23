import { render } from '@testing-library/react'
import Booking from './Booking'

describe('Booking Component', () => {
  it('renders without crashing', () => {
    render(<Booking />)
  })
})