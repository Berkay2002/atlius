import { render } from '@testing-library/react';
import App from './App';

test('renders AtLius app', () => {
  const { getByPlaceholderText } = render(<App />);
  // Test that the search input is rendered
  const searchInput = getByPlaceholderText(/Sök efter lokal/i);
  expect(searchInput).toBeInTheDocument();
});
