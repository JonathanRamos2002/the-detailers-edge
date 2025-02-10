import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import Index from './index'; // Capitalize component name

vi.mock('react-router-dom', async () => {
 const actual = await vi.importActual('react-router-dom');
 return {
   ...actual,
   Link: ({ children, to }) => <a href={to}>{children}</a>
 };
});

vi.mock('../assets/hero.jpg', () => ({
 default: 'mocked-image.jpg'
}));

describe('Index Component', () => {
 beforeEach(() => {
   render(
     <BrowserRouter>
       <Index /> {/* Use capitalized component name */}
     </BrowserRouter>
   );
 });

 test('renders heading', () => {
   const heading = screen.getByRole('heading', {
     name: /welcome to the detailers edge/i
   });
   expect(heading).toBeDefined();
 });

 test('renders navigation link', () => {
   const link = screen.getByText(/book now/i);
   expect(link).toBeDefined();
   expect(link.getAttribute('href')).toBe('/booking');
 });

 test('displays showcase image', () => {
   const img = screen.getByRole('img', { name: /showcase/i });
   expect(img).toBeDefined();
   expect(img).toHaveAttribute('src', 'mocked-image.jpg');
 });
});