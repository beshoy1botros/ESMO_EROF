import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders copyright and author', () => {
    render(<Footer />);
    expect(screen.getByText(/Piswi Petroc/i)).toBeInTheDocument();
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});

