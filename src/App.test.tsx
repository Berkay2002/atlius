import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AtLius app', () => {
  render(<App />);
  // Test that the search input is rendered
  const searchInput = screen.getByPlaceholderText(/Sök efter lokal/i);
  expect(searchInput).toBeInTheDocument();
});
